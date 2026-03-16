import type { Metadata } from "next";

const VIDEO_URL =
  "https://fraction-friends-public-assets.s3.us-west-2.amazonaws.com/demo-video.mp4";

export const metadata: Metadata = {
  title: "Superbuilder Demo — Clone Tutor Synthesis",
  description: "Watch a demo of Superbuilder's Clone Tutor Synthesis by PakHunChan.",
  openGraph: {
    title: "Superbuilder Demo — Clone Tutor Synthesis",
    description: "Watch a demo of Superbuilder's Clone Tutor Synthesis by PakHunChan.",
    type: "video.other",
    videos: [{ url: VIDEO_URL, type: "video/mp4" }],
  },
};

export default function DemoVideoPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      <video
        src={VIDEO_URL}
        controls
        autoPlay
        playsInline
        style={{ maxWidth: "100%", maxHeight: "100vh" }}
      />
    </main>
  );
}
