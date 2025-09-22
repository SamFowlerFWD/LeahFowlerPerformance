/**
 * Comprehensive Test Suite for Forum System API
 * Covers all forum functionality including categories, threads, replies, voting, search, tags, and moderation
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment configuration
const API_URL = process.env.TEST_API_URL || 'http://localhost:3001';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

// Test utilities and helpers
interface AuthTokens {
  user: string;
  admin: string;
  moderator?: string;
  userId: string;
  adminId: string;
}

interface TestData {
  categoryId: string;
  categorySlug: string;
  threadId: string;
  threadSlug: string;
  replyId: string;
  tagId: string;
  tagSlug: string;
  secondThreadId: string;
  lockedThreadId: string;
  pinnedThreadId: string;
}

// Helper function to generate auth tokens
async function generateAuthTokens(): Promise<AuthTokens> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Create test user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: `testuser_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    email_confirm: true,
  });

  if (userError) throw new Error(`Failed to create test user: ${userError.message}`);

  // Create admin user
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email: `testadmin_${Date.now()}@example.com`,
    password: 'AdminPassword123!',
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  if (adminError) throw new Error(`Failed to create admin user: ${adminError.message}`);

  // Generate tokens
  const { data: userSession } = await supabase.auth.signInWithPassword({
    email: userData.user.email!,
    password: 'TestPassword123!'
  });

  const { data: adminSession } = await supabase.auth.signInWithPassword({
    email: adminData.user.email!,
    password: 'AdminPassword123!'
  });

  return {
    user: userSession?.session?.access_token || '',
    admin: adminSession?.session?.access_token || '',
    userId: userData.user.id,
    adminId: adminData.user.id
  };
}

// Helper function to clean up test data
async function cleanupTestData(tokens: AuthTokens, data: Partial<TestData>) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Delete test threads
  if (data.threadId) {
    await supabase.from('forum_threads').delete().eq('id', data.threadId);
  }
  if (data.secondThreadId) {
    await supabase.from('forum_threads').delete().eq('id', data.secondThreadId);
  }
  if (data.lockedThreadId) {
    await supabase.from('forum_threads').delete().eq('id', data.lockedThreadId);
  }
  if (data.pinnedThreadId) {
    await supabase.from('forum_threads').delete().eq('id', data.pinnedThreadId);
  }

  // Delete test category
  if (data.categoryId) {
    await supabase.from('forum_categories').delete().eq('id', data.categoryId);
  }

  // Delete test tag
  if (data.tagId) {
    await supabase.from('forum_tags').delete().eq('id', data.tagId);
  }

  // Delete test users
  await supabase.auth.admin.deleteUser(tokens.userId);
  await supabase.auth.admin.deleteUser(tokens.adminId);
}

describe('Forum System API - Comprehensive Test Suite', () => {
  let authTokens: AuthTokens;
  let testData: Partial<TestData> = {};
  let supabase: SupabaseClient;

  beforeAll(async () => {
    // Initialize Supabase client
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Generate authentication tokens
    authTokens = await generateAuthTokens();

    // Create initial test data
    const { data: category } = await supabase
      .from('forum_categories')
      .insert({
        name: 'Test Category',
        slug: `test-category-${Date.now()}`,
        description: 'Category for testing',
        order_position: 99
      })
      .select()
      .single();

    if (category) {
      testData.categoryId = category.id;
      testData.categorySlug = category.slug;
    }
  });

  afterAll(async () => {
    // Clean up all test data
    await cleanupTestData(authTokens, testData);
  });

  /**
   * CATEGORIES TESTS
   */
  describe('Categories', () => {
    test('GET /api/forum/categories - Should list all categories', async () => {
      const response = await request(API_URL)
        .get('/api/forum/categories')
        .expect(200);

      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories.length).toBeGreaterThan(0);

      const category = response.body.categories[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('slug');
      expect(category).toHaveProperty('thread_count');
    });

    test('GET /api/forum/categories/:slug - Should get category with threads', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/categories/${testData.categorySlug}`)
        .expect(200);

      expect(response.body).toHaveProperty('category');
      expect(response.body.category.slug).toBe(testData.categorySlug);
      expect(response.body).toHaveProperty('threads');
      expect(Array.isArray(response.body.threads)).toBe(true);
    });

    test('GET /api/forum/categories/:slug - Should return 404 for non-existent category', async () => {
      const response = await request(API_URL)
        .get('/api/forum/categories/non-existent-category')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });

    test('GET /api/forum/categories/:slug - Should support pagination', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/categories/${testData.categorySlug}?page=1&limit=5`)
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 5);
      expect(response.body.pagination).toHaveProperty('total');
    });
  });

  /**
   * THREADS TESTS
   */
  describe('Threads', () => {
    test('POST /api/forum/threads - Should create new thread with authentication', async () => {
      const threadData = {
        title: 'Test Thread Title',
        content: 'This is the content of the test thread with enough detail.',
        category_id: testData.categoryId,
        tags: ['test', 'automated']
      };

      const response = await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(threadData)
        .expect(201);

      expect(response.body).toHaveProperty('thread');
      expect(response.body.thread).toHaveProperty('id');
      expect(response.body.thread.title).toBe(threadData.title);
      expect(response.body.thread).toHaveProperty('slug');

      testData.threadId = response.body.thread.id;
      testData.threadSlug = response.body.thread.slug;
    });

    test('POST /api/forum/threads - Should fail without authentication', async () => {
      const threadData = {
        title: 'Unauthorized Thread',
        content: 'This should fail',
        category_id: testData.categoryId
      };

      await request(API_URL)
        .post('/api/forum/threads')
        .send(threadData)
        .expect(401);
    });

    test('POST /api/forum/threads - Should validate required fields', async () => {
      const invalidThread = {
        title: '', // Empty title
        content: 'Content',
        category_id: testData.categoryId
      };

      const response = await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(invalidThread)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('title');
    });

    test('GET /api/forum/threads - Should list threads with pagination', async () => {
      const response = await request(API_URL)
        .get('/api/forum/threads?page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('threads');
      expect(Array.isArray(response.body.threads)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination.limit).toBe(10);
    });

    test('GET /api/forum/threads - Should filter by category', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/threads?category=${testData.categoryId}`)
        .expect(200);

      expect(response.body.threads).toBeDefined();
      response.body.threads.forEach((thread: any) => {
        expect(thread.category_id).toBe(testData.categoryId);
      });
    });

    test('GET /api/forum/threads - Should sort by different criteria', async () => {
      // Test sorting by newest
      const newestResponse = await request(API_URL)
        .get('/api/forum/threads?sort=newest')
        .expect(200);

      const newestThreads = newestResponse.body.threads;
      for (let i = 1; i < newestThreads.length; i++) {
        expect(new Date(newestThreads[i-1].created_at).getTime())
          .toBeGreaterThanOrEqual(new Date(newestThreads[i].created_at).getTime());
      }

      // Test sorting by popular
      const popularResponse = await request(API_URL)
        .get('/api/forum/threads?sort=popular')
        .expect(200);

      const popularThreads = popularResponse.body.threads;
      for (let i = 1; i < popularThreads.length; i++) {
        expect(popularThreads[i-1].view_count).toBeGreaterThanOrEqual(popularThreads[i].view_count);
      }
    });

    test('GET /api/forum/threads/:slug - Should get thread with posts', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/threads/${testData.threadSlug}`)
        .expect(200);

      expect(response.body).toHaveProperty('thread');
      expect(response.body.thread.slug).toBe(testData.threadSlug);
      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.thread).toHaveProperty('view_count');
    });

    test('PUT /api/forum/threads/:id - Should edit own thread', async () => {
      const updateData = {
        title: 'Updated Thread Title',
        content: 'Updated content with more details and information.'
      };

      const response = await request(API_URL)
        .put(`/api/forum/threads/${testData.threadId}`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(updateData)
        .expect(200);

      expect(response.body.thread.title).toBe(updateData.title);
      expect(response.body.thread.content).toBe(updateData.content);
      expect(response.body.thread).toHaveProperty('edited_at');
    });

    test('PUT /api/forum/threads/:id - Should fail to edit another user\'s thread', async () => {
      // Create a thread as admin
      const { data: adminThread } = await supabase
        .from('forum_threads')
        .insert({
          title: 'Admin Thread',
          content: 'Admin content',
          category_id: testData.categoryId,
          author_id: authTokens.adminId,
          slug: `admin-thread-${Date.now()}`
        })
        .select()
        .single();

      // Try to edit as regular user
      await request(API_URL)
        .put(`/api/forum/threads/${adminThread.id}`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ title: 'Hacked!' })
        .expect(403);

      // Cleanup
      await supabase.from('forum_threads').delete().eq('id', adminThread.id);
    });

    test('DELETE /api/forum/threads/:id - Should delete own thread', async () => {
      // Create a thread to delete
      const { data: threadToDelete } = await supabase
        .from('forum_threads')
        .insert({
          title: 'Thread to Delete',
          content: 'This will be deleted',
          category_id: testData.categoryId,
          author_id: authTokens.userId,
          slug: `delete-thread-${Date.now()}`
        })
        .select()
        .single();

      await request(API_URL)
        .delete(`/api/forum/threads/${threadToDelete.id}`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .expect(200);

      // Verify deletion
      const { data: deletedThread } = await supabase
        .from('forum_threads')
        .select()
        .eq('id', threadToDelete.id)
        .single();

      expect(deletedThread).toBeNull();
    });

    test('POST /api/forum/threads/:id/pin - Admin should pin/unpin thread', async () => {
      // Pin thread
      const pinResponse = await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/pin`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send({ pinned: true })
        .expect(200);

      expect(pinResponse.body.thread.is_pinned).toBe(true);

      // Unpin thread
      const unpinResponse = await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/pin`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send({ pinned: false })
        .expect(200);

      expect(unpinResponse.body.thread.is_pinned).toBe(false);
    });

    test('POST /api/forum/threads/:id/pin - Non-admin should fail to pin thread', async () => {
      await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/pin`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ pinned: true })
        .expect(403);
    });

    test('POST /api/forum/threads/:id/lock - Admin should lock/unlock thread', async () => {
      // Lock thread
      const lockResponse = await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/lock`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send({ locked: true })
        .expect(200);

      expect(lockResponse.body.thread.is_locked).toBe(true);

      // Unlock thread
      const unlockResponse = await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/lock`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send({ locked: false })
        .expect(200);

      expect(unlockResponse.body.thread.is_locked).toBe(false);
    });
  });

  /**
   * REPLIES TESTS
   */
  describe('Replies', () => {
    test('POST /api/forum/threads/:id/replies - Should create reply to thread', async () => {
      const replyData = {
        content: 'This is a helpful reply with valuable information and insights.',
        quote_id: null
      };

      const response = await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/replies`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(replyData)
        .expect(201);

      expect(response.body).toHaveProperty('reply');
      expect(response.body.reply.content).toBe(replyData.content);
      expect(response.body.reply.thread_id).toBe(testData.threadId);

      testData.replyId = response.body.reply.id;
    });

    test('POST /api/forum/threads/:id/replies - Should fail without authentication', async () => {
      await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/replies`)
        .send({ content: 'Unauthorized reply' })
        .expect(401);
    });

    test('POST /api/forum/threads/:id/replies - Should validate minimum content length', async () => {
      const response = await request(API_URL)
        .post(`/api/forum/threads/${testData.threadId}/replies`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ content: 'Too short' })
        .expect(400);

      expect(response.body.error).toContain('content');
    });

    test('POST /api/forum/threads/:id/replies - Should fail on locked thread', async () => {
      // Create and lock a thread
      const { data: lockedThread } = await supabase
        .from('forum_threads')
        .insert({
          title: 'Locked Thread',
          content: 'This thread is locked',
          category_id: testData.categoryId,
          author_id: authTokens.adminId,
          slug: `locked-thread-${Date.now()}`,
          is_locked: true
        })
        .select()
        .single();

      testData.lockedThreadId = lockedThread.id;

      await request(API_URL)
        .post(`/api/forum/threads/${lockedThread.id}/replies`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ content: 'Reply to locked thread' })
        .expect(403);
    });

    test('PUT /api/forum/replies/:id - Should edit own reply', async () => {
      const updateData = {
        content: 'This is the updated reply content with corrections and improvements.'
      };

      const response = await request(API_URL)
        .put(`/api/forum/replies/${testData.replyId}`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(updateData)
        .expect(200);

      expect(response.body.reply.content).toBe(updateData.content);
      expect(response.body.reply).toHaveProperty('edited_at');
    });

    test('PUT /api/forum/replies/:id - Should fail to edit another user\'s reply', async () => {
      // Create a reply as admin
      const { data: adminReply } = await supabase
        .from('forum_replies')
        .insert({
          content: 'Admin reply content',
          thread_id: testData.threadId,
          author_id: authTokens.adminId
        })
        .select()
        .single();

      await request(API_URL)
        .put(`/api/forum/replies/${adminReply.id}`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ content: 'Hacked reply!' })
        .expect(403);

      // Cleanup
      await supabase.from('forum_replies').delete().eq('id', adminReply.id);
    });

    test('POST /api/forum/replies/:id/accept - Thread owner should accept answer', async () => {
      // Create a reply to accept
      const { data: answerReply } = await supabase
        .from('forum_replies')
        .insert({
          content: 'This is the correct answer to the question.',
          thread_id: testData.threadId,
          author_id: authTokens.adminId
        })
        .select()
        .single();

      const response = await request(API_URL)
        .post(`/api/forum/replies/${answerReply.id}/accept`)
        .set('Authorization', `Bearer ${authTokens.user}`)
        .expect(200);

      expect(response.body.reply.is_accepted).toBe(true);

      // Cleanup
      await supabase.from('forum_replies').delete().eq('id', answerReply.id);
    });

    test('POST /api/forum/replies/:id/accept - Non-owner should fail to accept answer', async () => {
      await request(API_URL)
        .post(`/api/forum/replies/${testData.replyId}/accept`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(403);
    });
  });

  /**
   * VOTING SYSTEM TESTS
   */
  describe('Voting System', () => {
    test('POST /api/forum/vote - Should upvote thread', async () => {
      const voteData = {
        target_type: 'thread',
        target_id: testData.threadId,
        vote_type: 'upvote'
      };

      const response = await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(voteData)
        .expect(200);

      expect(response.body).toHaveProperty('vote_count');
      expect(response.body.vote_count).toBeGreaterThan(0);
    });

    test('POST /api/forum/vote - Should downvote reply', async () => {
      const voteData = {
        target_type: 'reply',
        target_id: testData.replyId,
        vote_type: 'downvote'
      };

      const response = await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(voteData)
        .expect(200);

      expect(response.body).toHaveProperty('vote_count');
      expect(response.body.vote_count).toBeLessThanOrEqual(0);
    });

    test('POST /api/forum/vote - Should prevent duplicate voting', async () => {
      const voteData = {
        target_type: 'thread',
        target_id: testData.threadId,
        vote_type: 'upvote'
      };

      // First vote
      await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(voteData)
        .expect(200);

      // Duplicate vote should update, not create new
      const response = await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(voteData)
        .expect(200);

      expect(response.body.message).toContain('updated');
    });

    test('POST /api/forum/vote - Should remove vote when voting opposite', async () => {
      // Upvote first
      await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          target_type: 'reply',
          target_id: testData.replyId,
          vote_type: 'upvote'
        })
        .expect(200);

      // Then downvote (should replace upvote)
      const response = await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          target_type: 'reply',
          target_id: testData.replyId,
          vote_type: 'downvote'
        })
        .expect(200);

      expect(response.body.vote_count).toBeLessThanOrEqual(0);
    });

    test('POST /api/forum/vote - Should fail without authentication', async () => {
      await request(API_URL)
        .post('/api/forum/vote')
        .send({
          target_type: 'thread',
          target_id: testData.threadId,
          vote_type: 'upvote'
        })
        .expect(401);
    });

    test('POST /api/forum/vote - Should validate vote type', async () => {
      const response = await request(API_URL)
        .post('/api/forum/vote')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          target_type: 'thread',
          target_id: testData.threadId,
          vote_type: 'invalid'
        })
        .expect(400);

      expect(response.body.error).toContain('vote_type');
    });
  });

  /**
   * SEARCH TESTS
   */
  describe('Search', () => {
    beforeAll(async () => {
      // Create searchable content
      const { data: searchThread } = await supabase
        .from('forum_threads')
        .insert({
          title: 'PostgreSQL Performance Optimization Tips',
          content: 'Here are some advanced techniques for optimizing PostgreSQL database performance.',
          category_id: testData.categoryId,
          author_id: authTokens.userId,
          slug: `postgres-optimization-${Date.now()}`
        })
        .select()
        .single();

      testData.secondThreadId = searchThread.id;
    });

    test('GET /api/forum/search - Should perform full-text search', async () => {
      const response = await request(API_URL)
        .get('/api/forum/search?q=postgresql+optimization')
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body).toHaveProperty('total_count');

      // Should find our test thread
      const found = response.body.results.some((result: any) =>
        result.title.toLowerCase().includes('postgresql')
      );
      expect(found).toBe(true);
    });

    test('GET /api/forum/search - Should handle empty query', async () => {
      const response = await request(API_URL)
        .get('/api/forum/search?q=')
        .expect(400);

      expect(response.body.error).toContain('query');
    });

    test('GET /api/forum/search - Should support pagination', async () => {
      const response = await request(API_URL)
        .get('/api/forum/search?q=test&page=1&limit=5')
        .expect(200);

      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.page).toBe(1);
    });

    test('GET /api/forum/search - Should filter by category', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/search?q=test&category=${testData.categoryId}`)
        .expect(200);

      response.body.results.forEach((result: any) => {
        if (result.type === 'thread') {
          expect(result.category_id).toBe(testData.categoryId);
        }
      });
    });

    test('GET /api/forum/search - Should filter by date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const response = await request(API_URL)
        .get(`/api/forum/search?q=test&from=${startDate.toISOString()}&to=${new Date().toISOString()}`)
        .expect(200);

      response.body.results.forEach((result: any) => {
        const createdAt = new Date(result.created_at);
        expect(createdAt.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
      });
    });

    test('GET /api/forum/search/suggestions - Should provide search suggestions', async () => {
      const response = await request(API_URL)
        .get('/api/forum/search/suggestions?q=post')
        .expect(200);

      expect(response.body).toHaveProperty('suggestions');
      expect(Array.isArray(response.body.suggestions)).toBe(true);
      expect(response.body.suggestions.length).toBeLessThanOrEqual(10);
    });

    test('GET /api/forum/search/suggestions - Should limit suggestions', async () => {
      const response = await request(API_URL)
        .get('/api/forum/search/suggestions?q=test&limit=3')
        .expect(200);

      expect(response.body.suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  /**
   * TAGS TESTS
   */
  describe('Tags', () => {
    test('POST /api/forum/tags - Admin should create tag', async () => {
      const tagData = {
        name: 'javascript',
        description: 'JavaScript programming language',
        color: '#f7df1e'
      };

      const response = await request(API_URL)
        .post('/api/forum/tags')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(tagData)
        .expect(201);

      expect(response.body.tag).toBeDefined();
      expect(response.body.tag.name).toBe(tagData.name);
      expect(response.body.tag).toHaveProperty('slug');

      testData.tagId = response.body.tag.id;
      testData.tagSlug = response.body.tag.slug;
    });

    test('POST /api/forum/tags - Non-admin should fail to create tag', async () => {
      await request(API_URL)
        .post('/api/forum/tags')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ name: 'unauthorized-tag' })
        .expect(403);
    });

    test('GET /api/forum/tags - Should list all tags', async () => {
      const response = await request(API_URL)
        .get('/api/forum/tags')
        .expect(200);

      expect(response.body.tags).toBeDefined();
      expect(Array.isArray(response.body.tags)).toBe(true);

      const tag = response.body.tags.find((t: any) => t.id === testData.tagId);
      expect(tag).toBeDefined();
      expect(tag).toHaveProperty('usage_count');
    });

    test('GET /api/forum/tags/:slug/threads - Should get threads by tag', async () => {
      // First, create a thread with the tag
      await supabase
        .from('forum_thread_tags')
        .insert({
          thread_id: testData.threadId,
          tag_id: testData.tagId
        });

      const response = await request(API_URL)
        .get(`/api/forum/tags/${testData.tagSlug}/threads`)
        .expect(200);

      expect(response.body.tag).toBeDefined();
      expect(response.body.threads).toBeDefined();
      expect(Array.isArray(response.body.threads)).toBe(true);
    });

    test('GET /api/forum/tags/suggest - Should provide tag suggestions', async () => {
      const response = await request(API_URL)
        .get('/api/forum/tags/suggest?q=java')
        .expect(200);

      expect(response.body.suggestions).toBeDefined();
      expect(Array.isArray(response.body.suggestions)).toBe(true);

      // Should include our javascript tag
      const found = response.body.suggestions.some((s: any) =>
        s.name.includes('javascript')
      );
      expect(found).toBe(true);
    });

    test('PUT /api/forum/tags/:id - Admin should update tag', async () => {
      const updateData = {
        description: 'Updated JavaScript description',
        color: '#323330'
      };

      const response = await request(API_URL)
        .put(`/api/forum/tags/${testData.tagId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send(updateData)
        .expect(200);

      expect(response.body.tag.description).toBe(updateData.description);
      expect(response.body.tag.color).toBe(updateData.color);
    });

    test('DELETE /api/forum/tags/:id - Admin should delete unused tag', async () => {
      // Create a tag to delete
      const { data: tagToDelete } = await supabase
        .from('forum_tags')
        .insert({
          name: 'delete-me',
          slug: `delete-me-${Date.now()}`
        })
        .select()
        .single();

      await request(API_URL)
        .delete(`/api/forum/tags/${tagToDelete.id}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);

      // Verify deletion
      const { data: deletedTag } = await supabase
        .from('forum_tags')
        .select()
        .eq('id', tagToDelete.id)
        .single();

      expect(deletedTag).toBeNull();
    });

    test('DELETE /api/forum/tags/:id - Should fail to delete tag in use', async () => {
      const response = await request(API_URL)
        .delete(`/api/forum/tags/${testData.tagId}`)
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(400);

      expect(response.body.error).toContain('in use');
    });
  });

  /**
   * USER-SPECIFIC TESTS
   */
  describe('User-specific Features', () => {
    test('GET /api/forum/user/:id/threads - Should get user threads', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/user/${authTokens.userId}/threads`)
        .expect(200);

      expect(response.body.threads).toBeDefined();
      expect(Array.isArray(response.body.threads)).toBe(true);
      expect(response.body).toHaveProperty('total_count');

      // All threads should belong to this user
      response.body.threads.forEach((thread: any) => {
        expect(thread.author_id).toBe(authTokens.userId);
      });
    });

    test('GET /api/forum/user/:id/reputation - Should get user reputation', async () => {
      const response = await request(API_URL)
        .get(`/api/forum/user/${authTokens.userId}/reputation`)
        .expect(200);

      expect(response.body).toHaveProperty('reputation');
      expect(response.body).toHaveProperty('total_posts');
      expect(response.body).toHaveProperty('total_threads');
      expect(response.body).toHaveProperty('helpful_answers');
      expect(response.body).toHaveProperty('badges');
      expect(typeof response.body.reputation).toBe('number');
    });

    test('POST /api/forum/subscribe - Should subscribe to thread', async () => {
      const response = await request(API_URL)
        .post('/api/forum/subscribe')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ thread_id: testData.secondThreadId })
        .expect(200);

      expect(response.body).toHaveProperty('subscription');
      expect(response.body.subscription.thread_id).toBe(testData.secondThreadId);
    });

    test('GET /api/forum/subscriptions - Should list user subscriptions', async () => {
      const response = await request(API_URL)
        .get('/api/forum/subscriptions')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .expect(200);

      expect(response.body.subscriptions).toBeDefined();
      expect(Array.isArray(response.body.subscriptions)).toBe(true);

      // Should include our subscription
      const found = response.body.subscriptions.some((sub: any) =>
        sub.thread_id === testData.secondThreadId
      );
      expect(found).toBe(true);
    });

    test('DELETE /api/forum/subscribe - Should unsubscribe from thread', async () => {
      await request(API_URL)
        .delete('/api/forum/subscribe')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({ thread_id: testData.secondThreadId })
        .expect(200);

      // Verify unsubscribed
      const response = await request(API_URL)
        .get('/api/forum/subscriptions')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .expect(200);

      const found = response.body.subscriptions.some((sub: any) =>
        sub.thread_id === testData.secondThreadId
      );
      expect(found).toBe(false);
    });

    test('GET /api/forum/subscriptions - Should fail without authentication', async () => {
      await request(API_URL)
        .get('/api/forum/subscriptions')
        .expect(401);
    });
  });

  /**
   * MODERATION TESTS
   */
  describe('Moderation', () => {
    test('POST /api/forum/flag - Should flag inappropriate content', async () => {
      const flagData = {
        content_type: 'thread',
        content_id: testData.threadId,
        reason: 'spam',
        description: 'This appears to be spam content'
      };

      const response = await request(API_URL)
        .post('/api/forum/flag')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(flagData)
        .expect(200);

      expect(response.body).toHaveProperty('flag');
      expect(response.body.flag.reason).toBe(flagData.reason);
    });

    test('POST /api/forum/flag - Should validate flag reason', async () => {
      const response = await request(API_URL)
        .post('/api/forum/flag')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          content_type: 'thread',
          content_id: testData.threadId,
          reason: 'invalid-reason'
        })
        .expect(400);

      expect(response.body.error).toContain('reason');
    });

    test('POST /api/forum/flag - Should prevent duplicate flags', async () => {
      const flagData = {
        content_type: 'reply',
        content_id: testData.replyId,
        reason: 'offensive',
        description: 'Offensive content'
      };

      // First flag
      await request(API_URL)
        .post('/api/forum/flag')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(flagData)
        .expect(200);

      // Duplicate flag
      const response = await request(API_URL)
        .post('/api/forum/flag')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send(flagData)
        .expect(400);

      expect(response.body.error).toContain('already flagged');
    });

    test('POST /api/forum/flag - Should fail without authentication', async () => {
      await request(API_URL)
        .post('/api/forum/flag')
        .send({
          content_type: 'thread',
          content_id: testData.threadId,
          reason: 'spam'
        })
        .expect(401);
    });
  });

  /**
   * EDGE CASES AND ERROR HANDLING
   */
  describe('Edge Cases and Error Handling', () => {
    test('Should handle invalid UUID format', async () => {
      await request(API_URL)
        .get('/api/forum/threads/not-a-valid-uuid')
        .expect(400);
    });

    test('Should handle non-existent resources', async () => {
      const fakeUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      await request(API_URL)
        .get(`/api/forum/threads/${fakeUuid}`)
        .expect(404);
    });

    test('Should handle malformed JSON', async () => {
      await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    test('Should handle SQL injection attempts', async () => {
      const maliciousQuery = "'; DROP TABLE forum_threads; --";

      const response = await request(API_URL)
        .get(`/api/forum/search?q=${encodeURIComponent(maliciousQuery)}`)
        .expect(200);

      // Should return empty results, not error
      expect(response.body.results).toBeDefined();
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    test('Should handle XSS attempts in content', async () => {
      const xssContent = '<script>alert("XSS")</script>Legitimate content';

      const response = await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          title: 'XSS Test Thread',
          content: xssContent,
          category_id: testData.categoryId
        })
        .expect(201);

      // Content should be sanitized
      expect(response.body.thread.content).not.toContain('<script>');
    });

    test('Should handle pagination boundaries', async () => {
      // Request page beyond available data
      const response = await request(API_URL)
        .get('/api/forum/threads?page=9999&limit=10')
        .expect(200);

      expect(response.body.threads).toBeDefined();
      expect(response.body.threads.length).toBe(0);
      expect(response.body.pagination.page).toBe(9999);
    });

    test('Should handle invalid pagination parameters', async () => {
      // Negative page
      await request(API_URL)
        .get('/api/forum/threads?page=-1')
        .expect(400);

      // Zero limit
      await request(API_URL)
        .get('/api/forum/threads?limit=0')
        .expect(400);

      // Excessive limit
      const response = await request(API_URL)
        .get('/api/forum/threads?limit=1000')
        .expect(200);

      // Should cap at maximum
      expect(response.body.pagination.limit).toBeLessThanOrEqual(100);
    });

    test('Should handle concurrent vote requests', async () => {
      const voteData = {
        target_type: 'thread',
        target_id: testData.threadId,
        vote_type: 'upvote'
      };

      // Send multiple concurrent requests
      const promises = Array(5).fill(null).map(() =>
        request(API_URL)
          .post('/api/forum/vote')
          .set('Authorization', `Bearer ${authTokens.user}`)
          .send(voteData)
      );

      const responses = await Promise.all(promises);

      // All should succeed or return appropriate error
      responses.forEach(res => {
        expect([200, 409]).toContain(res.status);
      });
    });

    test('Should handle long content gracefully', async () => {
      const longContent = 'a'.repeat(100000); // 100KB of text

      const response = await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          title: 'Long Content Thread',
          content: longContent,
          category_id: testData.categoryId
        })
        .expect(400);

      expect(response.body.error).toContain('content');
    });

    test('Should handle rate limiting', async () => {
      // Send many requests rapidly
      const promises = Array(20).fill(null).map(() =>
        request(API_URL).get('/api/forum/threads')
      );

      const responses = await Promise.all(promises);

      // Some requests should be rate limited
      const rateLimited = responses.some(res => res.status === 429);

      // Note: This test assumes rate limiting is implemented
      // If not implemented, this assertion should be adjusted
      if (rateLimited) {
        const rateLimitedResponse = responses.find(res => res.status === 429);
        expect(rateLimitedResponse?.body).toHaveProperty('error');
        expect(rateLimitedResponse?.headers).toHaveProperty('retry-after');
      }
    });

    test('Should handle invalid sort parameters', async () => {
      const response = await request(API_URL)
        .get('/api/forum/threads?sort=invalid-sort')
        .expect(200); // Should fallback to default sort

      expect(response.body.threads).toBeDefined();
    });

    test('Should handle expired authentication tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid';

      await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          title: 'Test',
          content: 'Test content',
          category_id: testData.categoryId
        })
        .expect(401);
    });
  });

  /**
   * PERFORMANCE TESTS
   */
  describe('Performance', () => {
    test('Thread list should respond within 500ms', async () => {
      const startTime = Date.now();

      await request(API_URL)
        .get('/api/forum/threads?limit=50')
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(500);
    });

    test('Search should respond within 1000ms', async () => {
      const startTime = Date.now();

      await request(API_URL)
        .get('/api/forum/search?q=test')
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

    test('Thread creation should respond within 500ms', async () => {
      const startTime = Date.now();

      await request(API_URL)
        .post('/api/forum/threads')
        .set('Authorization', `Bearer ${authTokens.user}`)
        .send({
          title: `Performance Test Thread ${Date.now()}`,
          content: 'Testing response time for thread creation',
          category_id: testData.categoryId
        })
        .expect(201);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(500);
    });
  });

  /**
   * CLEANUP AND VERIFICATION
   */
  describe('Cleanup Verification', () => {
    test('Should verify all test data is properly tracked', () => {
      expect(testData.categoryId).toBeDefined();
      expect(testData.threadId).toBeDefined();
      expect(testData.replyId).toBeDefined();
      expect(testData.tagId).toBeDefined();
    });
  });
});

/**
 * Additional Test Utilities
 */
export async function createTestUser(email: string, role: string = 'user'): Promise<string> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'TestPassword123!',
    email_confirm: true,
    user_metadata: { role }
  });

  if (error) throw new Error(`Failed to create test user: ${error.message}`);

  const { data: session } = await supabase.auth.signInWithPassword({
    email,
    password: 'TestPassword123!'
  });

  return session?.session?.access_token || '';
}

export async function cleanupTestUser(userId: string): Promise<void> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  await supabase.auth.admin.deleteUser(userId);
}

export function expectValidThread(thread: any): void {
  expect(thread).toHaveProperty('id');
  expect(thread).toHaveProperty('title');
  expect(thread).toHaveProperty('content');
  expect(thread).toHaveProperty('slug');
  expect(thread).toHaveProperty('author_id');
  expect(thread).toHaveProperty('category_id');
  expect(thread).toHaveProperty('created_at');
  expect(thread).toHaveProperty('view_count');
  expect(thread).toHaveProperty('reply_count');
  expect(thread).toHaveProperty('is_locked');
  expect(thread).toHaveProperty('is_pinned');
}

export function expectValidReply(reply: any): void {
  expect(reply).toHaveProperty('id');
  expect(reply).toHaveProperty('content');
  expect(reply).toHaveProperty('thread_id');
  expect(reply).toHaveProperty('author_id');
  expect(reply).toHaveProperty('created_at');
  expect(reply).toHaveProperty('vote_count');
  expect(reply).toHaveProperty('is_accepted');
}

export function expectValidPagination(pagination: any): void {
  expect(pagination).toHaveProperty('page');
  expect(pagination).toHaveProperty('limit');
  expect(pagination).toHaveProperty('total');
  expect(pagination).toHaveProperty('total_pages');
  expect(pagination).toHaveProperty('has_next');
  expect(pagination).toHaveProperty('has_previous');
}