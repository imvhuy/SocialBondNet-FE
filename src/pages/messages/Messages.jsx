import { useEffect, useMemo, useRef, useState } from "react"
import userAvatar from "../../assets/diverse-user-avatars.png"
import jamesAvatar from "../../assets/finn-avatar.png"
import mariaAvatar from "../../assets/medic-avatar.png"
import davidAvatar from "../../assets/file-system-avatar.png"
import mariaRAvatar from "../../assets/taskon-avatar.png"
import placeholderImg from "../../assets/placeholder.png"
import "../../pages/messages/Messages.css"
function Messages() {
  const contacts = useMemo(
    () => [
      { id: "james", name: "James Johnson", last: "You: Guko ruviwiuj virovo na te.", minutes: 5, avatar: jamesAvatar, online: true },
      { id: "mariaH", name: "Maria Hernandez", last: "Salhaomo haboon oknabjo gok ollaucu.", minutes: 1, avatar: mariaAvatar },
      { id: "david", name: "David Smith", last: "You: Rawivu acwol wobihsiv uni hok.", minutes: 6, avatar: davidAvatar },
      { id: "mariaR", name: "Maria Rodriguez", last: "Nobir ac decuj hace pawo weowi iflo.", minutes: 1, avatar: mariaRAvatar },
    ],
    []
  )

  const [activeId, setActiveId] = useState(contacts[0].id)
  const active = contacts.find((c) => c.id === activeId) || contacts[0]

  const [query, setQuery] = useState("")
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))

  const [messages, setMessages] = useState(() => [
    { id: 1, from: "james", text: "Eh vuco wapa gozupdu fe.", at: Date.now() - 60 * 60 * 1000 },
    { id: 2, from: "james", text: "Zomom hej maz timep webpavej hakmul foar bohoj ked kewbamroj.", at: Date.now() - 30 * 60 * 1000 },
    { id: 3, from: "me", text: "Bafun boci ahotu wutampil uh.", at: Date.now() - 6 * 60 * 1000 },
    { id: 4, from: "me", image: placeholderImg, at: Date.now() - 5 * 60 * 1000 },
    { id: 5, from: "james", text: "Guko ruviwiuj virovo na te.", at: Date.now() - 60 * 1000 },
  ])

  const [text, setText] = useState("")
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeId])

  // Không cần ngăn body scroll nữa vì không dùng fixed position

  function formatRelative(ts) {
    const diff = Math.max(1, Math.round((Date.now() - ts) / 60000))
    if (diff < 60) return `${diff} minutes ago`
    const h = Math.round(diff / 60)
    return `${h} hour${h > 1 ? "s" : ""} ago`
  }

  function send() {
    if (!text.trim()) return
    setMessages((m) => [...m, { id: Math.random(), from: "me", text, at: Date.now() }])
    setText("")
  }

  return (
    <div className="messages-page-wrapper">
      <div className="messages-container">
      {/* Contacts column */}
      <aside className="contacts-sidebar">
        <div className="contacts-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img src={userAvatar} alt="You" className="user-avatar" />
            <div>
              <div style={{ fontWeight: 700 }}>John Deo</div>
              <div className="muted" style={{ fontSize: 13 }}>Marketing Manager</div>
            </div>
          </div>

          <input
            type="search"
            placeholder="Search contacts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-box"
          />

          <div className="muted" style={{ fontSize: 12, margin: "12px 0" }}>Recent Chats</div>
        </div>

        <div className="contacts-list">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`btn ${activeId === c.id ? 'active' : ''}`}
            >
              <img src={c.avatar} alt={c.name} className="user-avatar" />
              <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                <div className="muted" style={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{c.last}</div>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{c.minutes} minutes</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Conversation column */}
      <section className="conversation-section">
        {/* Header */}
        <div className="conversation-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={active.avatar} alt={active.name} className="user-avatar" />
            <div>
              <div style={{ fontWeight: 800 }}>{active.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{active.online ? "online" : ""}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <IconButton label="phone" />
            <IconButton label="video" />
            <IconButton label="sidebar" />
          </div>
        </div>

        {/* Messages list */}
        <div className="messages-area">
          {messages.map((m) => (
            <MessageBubble key={m.id} me={m.from === "me"} text={m.text} image={m.image} when={formatRelative(m.at)} avatar={m.from === "me" ? userAvatar : active.avatar} />
          ))}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="message-composer">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a Message"
            style={{ flex: 1, padding: "12px 16px", borderRadius: 9999, border: "1px solid var(--border)", background: "transparent", color: "var(--text)" }}
          />
          <IconButton label="emoji" />
          <IconButton label="attach" />
          <button className="btn btn-primary" onClick={send} disabled={!text.trim()} style={{ opacity: text.trim() ? 1 : 0.5 }}>Send</button>
        </div>
      </section>

      {/* Details column */}
      <aside className="details-sidebar">
        <div style={{ fontWeight: 800, marginBottom: 12 }}>Media (1)</div>
        <img src={placeholderImg} alt="media" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", marginBottom: 16 }} />

        <div style={{ fontWeight: 800, display: "grid", gap: 8 }}> Attachments (5)
          <AttachmentItem name="service-task.pdf" size="2MB" />
          <AttachmentItem name="homepage-design.fig" size="3MB" />
          <AttachmentItem name="about-us.htmlf" size="1KB" />
          <AttachmentItem name="work-project.zip" size="20MB" />
          <AttachmentItem name="custom.js" size="2MB" />
        </div>
      </aside>
      </div>
    </div>
  )
}

function MessageBubble({ me, text, image, when, avatar }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: me ? "1fr auto 36px" : "36px auto 1fr", alignItems: "end", gap: 8 }}>
      {!me && <img src={avatar} alt="" className="user-avatar" />}
      <div style={{
        background: me ? "#e7f3ff" : "#f3f4f6",
        color: "var(--text)",
        padding: 12,
        borderRadius: 12,
        maxWidth: 460,
        justifySelf: me ? "end" : "start",
        border: `1px solid var(--border)`,
      }}>
        {text && <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>}
        {image && <img src={image} alt="attach" style={{ width: "100%", borderRadius: 8, marginTop: text ? 8 : 0 }} />}
        <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{when}</div>
      </div>
      {me && <img src={avatar} alt="" className="user-avatar" />}
    </div>
  )
}

function AttachmentItem({ name, size }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", alignItems: "center", gap: 12, padding: 8, borderRadius: 8, border: "1px solid var(--border)" }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eef2ff", display: "grid", placeItems: "center" }}>📄</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
        <div className="muted" style={{ fontSize: 12 }}>{size}</div>
      </div>
      <IconButton label="more" />
    </div>
  )
}

function IconButton({ label }) {
  return (
    <button aria-label={label} title={label} style={{ background: "transparent", border: "1px solid var(--border)", width: 36, height: 36, borderRadius: 8, display: "grid", placeItems: "center", cursor: "pointer" }}>
      <span style={{ fontSize: 16 }}>⋯</span>
    </button>
  )
}

export default Messages
