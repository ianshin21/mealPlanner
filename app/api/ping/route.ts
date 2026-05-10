export const runtime = "edge";

export async function GET() {
  return Response.json({
    ok: true,
    env: process.env.KAKAO_REST_API_KEY ? "set" : "missing",
  });
}
