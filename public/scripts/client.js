// scripts/client.js

document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkSession();
  await loadBookings(session.user.id);
});

async function createBooking() {
  const session = await checkSession();
  const clientId = session.user.id;

  const pickup = document.getElementById("pickup").value.trim();
  const dropoff = document.getElementById("dropoff").value.trim();

  if (!pickup || !dropoff) {
    alert("Inserisci partenza e arrivo");
    return;
  }

  await supabaseClient.from("bookings").insert({
    client_id: clientId,
    pickup,
    dropoff,
    status: "pending"
  });

  await loadBookings(clientId);
}

async function loadBookings(clientId) {
  const { data: bookings } = await supabaseClient
    .from("bookings")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  const container = document.getElementById("bookingsList");
  container.innerHTML = "";

  if (!bookings || bookings.length === 0) {
    container.innerHTML = "<p>Nessuna prenotazione trovata.</p>";
    return;
  }

  bookings.forEach(b => {
    const div = document.createElement("div");
    div.className = "p-4 bg-pearl border border-emerald/30 rounded-lg";
    div.innerHTML = `
      <p><strong>Partenza:</strong> ${b.pickup}</p>
      <p><strong>Arrivo:</strong> ${b.dropoff}</p>
      <p><strong>Stato:</strong> ${b.status}</p>
    `;
    container.appendChild(div);
  });
}

// Realtime: aggiorna lista prenotazioni
supabaseClient
  .channel("client-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "bookings" },
    async payload => {
      const { data } = await supabaseClient.auth.getSession();
      const session = data.session;
      if (!session) return;
      if (payload.new.client_id === session.user.id) {
        loadBookings(session.user.id);
      }
    }
  )
  .subscribe();
