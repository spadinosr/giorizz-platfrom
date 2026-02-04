// Carica stato driver all'avvio
document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkSession();
  const userId = session.user.id;

  // Recupera stato attuale
  const { data: statusRow } = await supabaseClient
    .from("driver_status")
    .select("status")
    .eq("user_id", userId)
    .single();

  let currentStatus = statusRow ? statusRow.status : "offline";

  updateStatusUI(currentStatus);

  // Carica corse assegnate
  loadAssignedRides(userId);
});

// Aggiorna UI in base allo stato
function updateStatusUI(status) {
  const label = document.getElementById("statusLabel");
  const button = document.getElementById("toggleStatus");

  if (status === "online") {
    label.textContent = "Stato attuale: Online";
    button.textContent = "Vai Offline";
    button.classList.remove("bg-emerald");
    button.classList.add("bg-gold", "text-night");
  } else {
    label.textContent = "Stato attuale: Offline";
    button.textContent = "Vai Online";
    button.classList.remove("bg-gold", "text-night");
    button.classList.add("bg-emerald", "text-pearl");
  }
}

// Toggle stato driver
document.getElementById("toggleStatus").addEventListener("click", async () => {
  const session = await checkSession();
  const userId = session.user.id;

  // Recupera stato attuale
  const { data: statusRow } = await supabaseClient
    .from("driver_status")
    .select("status")
    .eq("user_id", userId)
    .single();

  let newStatus = "online";

  if (statusRow && statusRow.status === "online") {
    newStatus = "offline";
  }

  // Aggiorna su Supabase
  await supabaseClient
    .from("driver_status")
    .upsert({
      user_id: userId,
      status: newStatus,
      updated_at: new Date()
    });

  updateStatusUI(newStatus);
});

// Carica corse assegnate
async function loadAssignedRides(driverId) {
  const { data: rides, error } = await supabaseClient
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
