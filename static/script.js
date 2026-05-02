// all contacts stored here after fetching
var allContacts = [];

// which contact is about to be deleted
var pendingDeleteId = null;

// ── Clock ──────────────────────────────────────────────────────
function updateClock() {
  var now = new Date();
  document.getElementById("clockDate").textContent = now.toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  });
  document.getElementById("clockTime").textContent = now.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
  });
}

// ── Section switching ──────────────────────────────────────────
function showSection(name) {
  // hide all pages
  var pages = document.querySelectorAll(".page");
  pages.forEach(function(p) { p.classList.remove("active"); });

  // mark nav link active
  setActiveNav(name);

  // show selected page
  document.getElementById("section-" + name).classList.add("active");

  // reload contacts when opening directory
  if (name === "directory") loadContacts();
}

function setActiveNav(name) {
  var links = document.querySelectorAll(".nav-link");
  links.forEach(function(l) { l.classList.remove("active"); });
  var activeLink = document.querySelector(".nav-link[data-section='" + name + "']");
  if (activeLink) activeLink.classList.add("active");
}

function openAddModal() {
  clearAddForm();
  clearErrors("");
  setActiveNav('add');
  document.getElementById("addOverlay").classList.add("open");
}

function closeAddModal() {
  document.getElementById("addOverlay").classList.remove("open");
  var activePage = document.querySelector(".page.active");
  if (activePage) {
    var sectionId = activePage.id.replace("section-", "");
    if (sectionId !== "add") setActiveNav(sectionId);
  }
}

// ── Load contacts from server ──────────────────────────────────
function loadContacts() {
  fetch("/api/contacts")
  .then(function(res) { return res.json(); })
  .then(function(data) {
    allContacts = data;
    renderTable(data);
    renderRecent(data);
    updateTotalCount(data.length);
  })
  .catch(function() {
    showToast("Could not load contacts.", "red");
  });
}

// ── Render table ───────────────────────────────────────────────
function renderTable(contacts) {
  var tbody = document.getElementById("contactBody");
  var emptyState = document.getElementById("emptyState");
  tbody.innerHTML = "";

  if (contacts.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  contacts.forEach(function(c) {
    var row = document.createElement("tr");
    row.innerHTML =
      "<td class='td-id'>" + c.contact_id + "</td>" +
      "<td class='td-name'>" + c.first_name + " " + c.last_name + "</td>" +
      "<td class='td-muted'>" + c.email + "</td>" +
      "<td class='td-muted'>" + c.phone + "</td>" +
      "<td class='td-muted'>" + c.address + "</td>" +
      "<td>" +
        "<button class='edit-btn' onclick='openEditModal(\"" + c.contact_id + "\")'>Edit</button>" +
        "<button class='del-btn' onclick='openDeleteModal(\"" + c.contact_id + "\")'>Delete</button>" +
      "</td>";
    tbody.appendChild(row);
  });
}

// ── Render recent list on dashboard ───────────────────────────
function renderRecent(contacts) {
  var list = document.getElementById("recentList");

  if (contacts.length === 0) {
    list.innerHTML = "<p class='empty-msg'>No contacts yet.</p>";
    return;
  }

  // show latest 4
  var recent = contacts.slice().reverse().slice(0, 4);
  list.innerHTML = "";

  recent.forEach(function(c) {
    var initials = (c.first_name[0] + c.last_name[0]).toUpperCase();
    var item = document.createElement("div");
    item.className = "recent-item";
    item.innerHTML =
      "<div class='ri-avatar'>" + initials + "</div>" +
      "<div>" +
        "<div class='ri-name'>" + c.first_name + " " + c.last_name + "</div>" +
        "<div class='ri-email'>" + c.email + "</div>" +
      "</div>" +
      "<span class='ri-id'>" + c.contact_id + "</span>";
    list.appendChild(item);
  });
}

// ── Update total count ─────────────────────────────────────────
function updateTotalCount(num) {
  document.getElementById("totalCount").textContent = num;
}

// ── Search contacts ────────────────────────────────────────────
function searchContacts() {
  var query = document.getElementById("searchInput").value.toLowerCase().trim();
  var filtered = allContacts.filter(function(c) {
    return (
      c.first_name.toLowerCase().includes(query) ||
      c.last_name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query)
    );
  });
  renderTable(filtered);
}

// ── Validate fields ────────────────────────────────────────────
function buildFieldId(prefix, field) {
  return prefix ? prefix + field.charAt(0).toUpperCase() + field.slice(1) : field;
}

function validateFields(prefix) {
  var firstName = document.getElementById(buildFieldId(prefix, "firstName")).value.trim();
  var lastName  = document.getElementById(buildFieldId(prefix, "lastName")).value.trim();
  var email     = document.getElementById(buildFieldId(prefix, "email")).value.trim();
  var phone     = document.getElementById(buildFieldId(prefix, "phone")).value.trim();
  var address   = document.getElementById(buildFieldId(prefix, "address")).value.trim();

  var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  var phoneRegex = /^\+?[1-9]\d{6,14}$/;

  var errors = {};
  if (!firstName)                        errors["firstName"] = "First name is required.";
  if (!lastName)                         errors["lastName"]  = "Last name is required.";
  if (!email)                            errors["email"]     = "Email is required.";
  else if (!emailRegex.test(email))      errors["email"]     = "Enter a valid email.";
  if (!phone)                            errors["phone"]     = "Phone number is required.";
  else if (!phoneRegex.test(phone.replace(/\s/g, ""))) errors["phone"] = "Enter a valid phone number.";
  if (!address)                          errors["address"]   = "Address is required.";

  return errors;
}

function showErrors(prefix, errors) {
  var fields = ["firstName","lastName","email","phone","address"];
  fields.forEach(function(f) {
    var fieldId = buildFieldId(prefix, f);
    var errEl = document.getElementById("err-" + fieldId);
    var input = document.getElementById(fieldId);
    if (errors[f]) {
      if (errEl) errEl.textContent = errors[f];
      if (input) input.classList.add("has-error");
    } else {
      if (errEl) errEl.textContent = "";
      if (input) input.classList.remove("has-error");
    }
  });
}

function clearErrors(prefix) {
  var fields = ["firstName","lastName","email","phone","address"];
  fields.forEach(function(f) {
    var fieldId = buildFieldId(prefix, f);
    var errEl = document.getElementById("err-" + fieldId);
    var input = document.getElementById(fieldId);
    if (errEl) errEl.textContent = "";
    if (input) input.classList.remove("has-error");
  });
}

// ── Submit new contact ─────────────────────────────────────────
function submitContact() {
  clearErrors("");

  var errors = validateFields("");
  if (Object.keys(errors).length > 0) {
    showErrors("", errors);
    return;
  }

  var payload = {
    first_name: document.getElementById("firstName").value.trim(),
    last_name:  document.getElementById("lastName").value.trim(),
    email:      document.getElementById("email").value.trim().toLowerCase(),
    phone:      document.getElementById("phone").value.trim(),
    address:    document.getElementById("address").value.trim()
  };

  fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.ok) {
      showToast("Contact saved successfully!", "green");
      clearAddForm();
      closeAddModal();
      loadContacts();
    } else {
      if (data.errors) showErrors("", data.errors);
      else showToast(data.message || "Something went wrong.", "red");
    }
  })
  .catch(function() {
    showToast("Network error. Try again.", "red");
  });
}

function clearAddForm() {
  ["firstName","lastName","email","phone","address"].forEach(function(id) {
    document.getElementById(id).value = "";
  });
  clearErrors("");
}

// ── Edit modal ─────────────────────────────────────────────────
function openEditModal(contactId) {
  var contact = allContacts.find(function(c) { return c.contact_id === contactId; });
  if (!contact) return;

  document.getElementById("editId").value          = contact.contact_id;
  document.getElementById("editFirstName").value   = contact.first_name;
  document.getElementById("editLastName").value    = contact.last_name;
  document.getElementById("editEmail").value       = contact.email;
  document.getElementById("editPhone").value       = contact.phone;
  document.getElementById("editAddress").value     = contact.address;

  clearErrors("edit");
  document.getElementById("editMsg").innerHTML = "";
  document.getElementById("editOverlay").classList.add("open");
}

function closeEditModal() {
  document.getElementById("editOverlay").classList.remove("open");
}

function updateContact() {
  clearErrors("edit");

  var errors = validateFields("edit");
  if (Object.keys(errors).length > 0) {
    showErrors("edit", errors);
    return;
  }

  var contactId = document.getElementById("editId").value;
  var payload = {
    first_name: document.getElementById("editFirstName").value.trim(),
    last_name:  document.getElementById("editLastName").value.trim(),
    email:      document.getElementById("editEmail").value.trim().toLowerCase(),
    phone:      document.getElementById("editPhone").value.trim(),
    address:    document.getElementById("editAddress").value.trim()
  };

  fetch("/api/contacts/" + contactId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.ok) {
      showToast("Contact updated!", "blue");
      closeEditModal();
      loadContacts();
    } else {
      if (data.errors) showErrors("edit", data.errors);
      else showToast(data.message || "Update failed.", "red");
    }
  })
  .catch(function() {
    showToast("Network error. Try again.", "red");
  });
}

// ── Delete modal ───────────────────────────────────────────────
function openDeleteModal(contactId) {
  pendingDeleteId = contactId;
  var contact = allContacts.find(function(c) { return c.contact_id === contactId; });
  var name = contact ? contact.first_name + " " + contact.last_name : contactId;
  document.getElementById("deleteMsg").textContent = '"' + name + '" will be permanently removed.';
  document.getElementById("deleteOverlay").classList.add("open");
}

function closeDeleteModal() {
  document.getElementById("deleteOverlay").classList.remove("open");
  pendingDeleteId = null;
}

function confirmDelete() {
  if (!pendingDeleteId) return;

  fetch("/api/contacts/" + pendingDeleteId, { method: "DELETE" })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.ok) {
      showToast("Contact deleted.", "red");
      closeDeleteModal();
      loadContacts();
    } else {
      showToast("Delete failed.", "red");
    }
  })
  .catch(function() {
    showToast("Network error.", "red");
  });
}

// close modals when clicking outside
document.getElementById("editOverlay").addEventListener("click", function(e) {
  if (e.target === this) closeEditModal();
});
document.getElementById("deleteOverlay").addEventListener("click", function(e) {
  if (e.target === this) closeDeleteModal();
});
document.getElementById("addOverlay").addEventListener("click", function(e) {
  if (e.target === this) closeAddModal();
});

// ── Toast ──────────────────────────────────────────────────────
function showToast(message, color) {
  var dotClass = color === "green" ? "dot-green" : color === "red" ? "dot-red" : "dot-blue";

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = "<div class='toast-dot " + dotClass + "'></div><span>" + message + "</span>";

  document.getElementById("toastBox").appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}

// ── Start ──────────────────────────────────────────────────────
window.onload = function() {
  updateClock();
  setInterval(updateClock, 1000);
  loadContacts();
};