import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface Props {
  senderName: string
  messagePreview: string
  listingTitle: string
  messagesUrl: string
}

export default function NewMessageEmail({
  senderName,
  messagePreview,
  listingTitle,
  messagesUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{senderName} 给您发了一条新消息</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "40px auto", backgroundColor: "#ffffff", borderRadius: 12, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 22, color: "#111827", marginBottom: 8 }}>
            您有一条新消息
          </Heading>
          <Text style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
            来自：<strong style={{ color: "#111827" }}>{senderName}</strong>
          </Text>

          <Section style={{ backgroundColor: "#f3f4f6", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
            <Text style={{ color: "#374151", fontSize: 14, margin: 0, lineHeight: "1.6" }}>
              {messagePreview}
            </Text>
          </Section>

          <Text style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
            房源：<strong style={{ color: "#111827" }}>{listingTitle}</strong>
          </Text>

          <Button
            href={messagesUrl}
            style={{
              backgroundColor: "#FF6B35",
              color: "#ffffff",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            查看消息
          </Button>

          <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 32 }}>
            熊猫之家 · Panda Stay Home
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
