// 기존 todos 문서에 user_id(userId) 컬럼을 명시적으로 채워두는 1회성 마이그레이션.
// GitHub 로그인 기능 추가 전에 만들어진 할일은 소유자가 없으므로 null로 설정한다.
// 실행: node scripts/migrate-add-user-id.mjs
import mongoose from "mongoose";

try {
  process.loadEnvFile(new URL("../.env.local", import.meta.url));
} catch {
  // .env.local이 없으면 이미 설정된 환경변수를 그대로 사용
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI 환경 변수가 없습니다 (.env.local 확인)");
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const result = await mongoose.connection
    .collection("todos")
    .updateMany({ userId: { $exists: false } }, { $set: { userId: null } });
  console.log(
    `마이그레이션 완료: ${result.modifiedCount}개 문서에 userId: null 추가`
  );
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
