#!/usr/bin/env node

// Simple test script to register and login a user
const { default: fetch } = require('node-fetch');

const API_URL = 'http://localhost:8000';
const email = 'rohankhanal114@gmail.com';
const password = 'Lordjesus1234@';
const name = 'Rohan Khanal';

async function testAuth() {
  console.log('Testing authentication...\n');

  try {
    // First, try to register the user
    console.log('1. Attempting to register user...');
    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        userType: 'patient'
      })
    });

    const registerResult = await registerResponse.json();
    console.log('Register result:', registerResult);

    // Then try to login
    console.log('\n2. Attempting to login...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const loginResult = await loginResponse.json();
    console.log('Login result:', loginResult);

    if (loginResult.success) {
      console.log('\n✅ Login successful!');
      console.log('User:', loginResult.user);
      console.log('Token:', loginResult.token ? 'Present' : 'Missing');
    } else {
      console.log('\n❌ Login failed:', loginResult.message);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuth();
