type User = {
  id: number;
  username: string;
  fname: string;
  lname: string;
  email: string;
};

function setup(): void {
  const output = document.querySelector<HTMLElement>("#output");
  const fetchUsersBtn = document.querySelector<HTMLButtonElement>("#get-users-btn");

  if (!output || !fetchUsersBtn) {
    throw new Error("Required DOM elements not found.");
  }

  fetchUsersBtn.addEventListener("click", (): Promise<void>  => showUsers(output));
}

async function showUsers(output: HTMLElement): Promise<void> {
  output.innerHTML = `<p>Loading users...</p>`;

  try {
    const response = await fetch("http://localhost:7070/api/users");

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isUserArray(data)) {
      throw new Error("Invalid user data structure.");
    }

    renderUsers(output, data);
  } catch (error) {
    console.error(error);
    output.innerHTML = `<p style="color: red;">Failed to load users.</p>`;
  }
}

function renderUsers(container: HTMLElement, users: User[]): void {
  if (users.length === 0) {
    container.innerHTML = "<p>No users found.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.style.listStyle = "none";
  list.style.padding = "0";
  list.style.margin = "0";

  for (const user of users) {
    const item = document.createElement("li");
    item.style.padding = "0.75rem 0";
    item.style.borderBottom = "1px solid #eee";

    item.innerHTML = `
      <strong>${escapeHtml(user.fname)} ${escapeHtml(user.lname)}</strong> (@${escapeHtml(user.username)})<br />
      <small>${escapeHtml(user.email)}</small>
    `;

    list.appendChild(item);
  }

  container.innerHTML = "";
  container.appendChild(list);
}

function isUserArray(data: unknown): data is User[] {
  return (
    Array.isArray(data) &&
    data.every(
      (u): boolean =>
        u &&
        typeof u === "object" &&
        "id" in u &&
        "username" in u &&
        "fname" in u &&
        "lname" in u &&
        "email" in u &&
        typeof (u as any).id === "number" &&
        typeof (u as any).username === "string" &&
        typeof (u as any).fname === "string" &&
        typeof (u as any).lname === "string" &&
        typeof (u as any).email === "string"
    )
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 🔥 Kick things off
setup();

