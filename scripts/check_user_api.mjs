const BASE_URL = 'http://localhost:5000';

async function check() {
  await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' }),
  });

  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' }),
  });
  const auth = await verifyRes.json();
  const token = auth.data.accessToken;

  const res = await fetch(`${BASE_URL}/api/users/cmwdjeqll001t78uzuyvkjgpo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = await res.json();
  console.log('User detail keys:', Object.keys(user.data));
  console.log('user.data.designation:', user.data.designation);
  console.log('user.data.profile:', user.data.profile);
}

check();
