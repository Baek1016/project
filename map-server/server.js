const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/location', (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(`클라이언트 위치: ${latitude}, ${longitude}`);
  res.json({
    message: '서버가 위치를 잘 받았어요!',
    received: { latitude, longitude }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
