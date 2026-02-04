// scripts/driver.js

document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkSession();
  const userId = session.user.id;

  const { data: statusRow } = await supabaseClient
    .from("driver_status")
    .select("status")
    .eq("user_id", userId)
    .single();

  const currentStatus = statusRow ? statusRow.status : "offline";
  updateStatusUI(currentStatus);
  loadAssignedRides(userId);
});

function updateStatusUI(status) {
  const label = document.getElementById("statusLabel");
  const button = document.getElementById("toggleStatus");

  if (status === "online") {
    label.textContent = "Stato attuale: Online";
    button.textContent = "Vai Offline";
    button.classList.remove("bg-emerald", "text-pearl");
    button.classList.add("bg-gold", "text-night");
  } else {
    label.textContent = "Stato attuale: Offline";
    button.textContent = "Vai Online";
    button.classList.remove("bg-gold", "text-night");
    button.classList.add("bg-emerald", "text-pearl");
  }
}

document.getElementById("toggleStatus").addEventListener("click", async () => {
  const session = await checkSession();
  const userId = session.user.id;

  const { data: statusRow } = await supabaseClient
    .from("driver_status")
    .select("status")
    .eq("user_id", userId)
    .single();

  let newStatus = "online";
  if (statusRow && statusRow.status === "online") newStatus = "offline";

  await supabaseClient
    .from("driver_status")
    .upsert({
      user_id: userId,
      status: newStatus,
      updated_at: new Date()
    });

  updateStatusUI(newStatus);
});

async function loadAssignedRides(driverId) {
  const { data: rides } = await supabaseClient
    .from("bookings")
    .select("*")
    .eq("driver_id", driverId)
    .order("created_at", { ascending: false });

  const container = document.getElementById("assignedRides");
  container.innerHTML = "";

  if (!rides || rides.length === 0) {
    container.innerHTML = "<p>Nessuna corsa assegnata.</p>";
    return;
  }

  rides.forEach(ride => {
    const div = document.createElement("div");
    div.className = "p-4 bg-pearl border border-emerald/30 rounded-lg";
    div.innerHTML = `
      <p><strong>Partenza:</strong> ${ride.pickup}</p>
      <p><strong>Arrivo:</strong> ${ride.dropoff}</p>
      <p><strong>Stato:</strong> ${ride.status}</p>
    `;
    container.appendChild(div);
  });
}

// Realtime: aggiorna corse assegnate
supabaseClient
  .channel("driver-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "bookings" },
    async payload => {
      const { data } = await supabaseClient.auth.getSession();
      const session = data.session;
      if (!session) return;
      if (payload.new.driver_id === session.user.id) {
        loadAssignedRides(session.user.id);
      }
    }
  )
  .subscribe();
