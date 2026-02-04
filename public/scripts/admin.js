// scripts/admin.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadClients();
  await loadDrivers();
  await loadBookings();
});

/* CLIENTI */
async function loadClients() {
  const { data: clients } = await supabaseClient
    .from("user_roles")
    .select("user_id, role")
    .eq("role", "client");

  const container = document.getElementById("clientsList");
  container.innerHTML = "";

  if (!clients || clients.length === 0) {
    container.innerHTML = "<p>Nessun cliente registrato.</p>";
    return;
  }

  for (const c of clients) {
    const user = await getUserInfo(c.user_id);
    const div = document.createElement("div");
    div.className = "p-4 bg-pearl border border-emerald/30 rounded-lg";
    div.innerHTML = `
      <p><strong>Email:</strong> ${user.email}</p>
      <button 
        class="mt-2 px-3 py-1 bg-gold text-night rounded hover:bg-emerald hover:text-pearl transition"
        onclick="deleteUser('${c.user_id}')"
      >
        Elimina Cliente
      </button>
    `;
    container.appendChild(div);
  }
}

/* DRIVER */
async function loadDrivers() {
  const { data: drivers } = await supabaseClient
    .from("user_roles")
    .select("user_id, role")
    .eq("role", "driver");

  const container = document.getElementById("driversList");
  container.innerHTML = "";

  if (!drivers || drivers.length === 0) {
    container.innerHTML = "<p>Nessun driver registrato.</p>";
    return;
  }

  for (const d of drivers) {
    const user = await getUserInfo(d.user_id);
    const div = document.createElement("div");
    div.className = "p-4 bg-pearl border border-emerald/30 rounded-lg";
    div.innerHTML = `
      <p><strong>Email:</strong> ${user.email}</p>
      <button 
        class="mt-2 px-3 py-1 bg-gold text-night rounded hover:bg-emerald hover:text-pearl transition"
        onclick="deleteUser('${d.user_id}')"
      >
        Elimina Driver
      </button>
    `;
    container.appendChild(div);
  }
}

/* PRENOTAZIONI */
async function loadBookings() {
  const { data: bookings } = await supabaseClient
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("adminBookings");
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

      <label class="block mt-2 text-sm">Assegna Driver (driver_id):</label>
      <input 
        id="driver-${b.id}" 
        class="w-full p-2 bg-white border border-emerald/40 rounded"
        placeholder="Inserisci driver_id"
      />

      <button 
        class="mt-3 px-3 py-1 bg-emerald text-pearl rounded hover:bg-gold hover:text-night transition"
        onclick="assignDriver('${b.id}')"
      >
        Assegna Driver
      </button>

      <button 
        class="mt-3 ml-2 px-3 py-1 bg-gold text-night rounded hover:bg-emerald hover:text-pearl transition"
        onclick="deleteBooking('${b.id}')"
      >
        Elimina Prenotazione
      </button>
    `;
    container.appendChild(div);
  });
}

/* SUPPORTO */
async function getUserInfo(userId) {
  const { data } = await supabaseClient.auth.admin.getUserById(userId);
  return data.user;
}

async function deleteUser(userId) {
  if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;

  await supabaseClient.auth.admin.deleteUser(userId);
  await supabaseClient.from("user_roles").delete().eq("user_id", userId);

  loadClients();
  loadDrivers();
}

async function deleteBooking(id) {
  if (!confirm("Eliminare questa prenotazione?")) return;

  await supabaseClient.from("bookings").delete().eq("id", id);
  loadBookings();
}

async function assignDriver(bookingId) {
  const driverId = document.getElementById(`driver-${bookingId}`).value.trim();
  if (!driverId) {
    alert("Inserisci un driver_id valido");
    return;
  }

  await supabaseClient
    .from("bookings")
    .update({ driver_id: driverId })
    .eq("id", bookingId);

  alert("Driver assegnato con successo");
  loadBookings();
}

/* REALTIME ADMIN */
supabaseClient
  .channel("admin-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "bookings" },
    payload => {
      console.log("Aggiornamento prenotazioni:", payload);
      loadBookings();
    }
  )
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "driver_status" },
    payload => {
      console.log("Aggiornamento driver:", payload);
      loadDrivers();
    }
  )
  .subscribe();
