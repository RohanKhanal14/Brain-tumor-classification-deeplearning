import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

// Mock useAuth for Navbar
const logout = vi.fn();
vi.mock("@/context/useAuth", () => ({
  useAuth: () => ({
    user: { id: "1", name: "Bob", email: "bob@example.com" },
    isAuthenticated: true,
    logout,
  }),
}));

describe("Navbar and ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders auth links and triggers logout", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Authenticated should show Profile trigger
    expect(screen.getByText(/mastishka/i)).toBeInTheDocument();

    // Open popover by clicking avatar button
    const avatarBtn = screen.getAllByRole("button")[1];
    await userEvent.click(avatarBtn);

    // Click Sign Out
    const signOut = await screen.findByRole("button", { name: /sign out/i });
    await userEvent.click(signOut);
    expect(logout).toHaveBeenCalled();
  });

  it("toggles theme and writes to localStorage", async () => {
    const ThemeConsumer = () => {
      const { setTheme } = useTheme();
      return (
        <div>
          <button onClick={() => setTheme("light")}>Set Light</button>
          <button onClick={() => setTheme("dark")}>Set Dark</button>
          <button onClick={() => setTheme("system")}>Set System</button>
        </div>
      );
    };

    render(
      <ThemeProvider defaultTheme="system" storageKey="neurai-theme">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await userEvent.click(screen.getByText(/set dark/i));
    expect(localStorage.getItem("neurai-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await userEvent.click(screen.getByText(/set light/i));
    expect(localStorage.getItem("neurai-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);

    await userEvent.click(screen.getByText(/set system/i));
    expect(localStorage.getItem("neurai-theme")).toBe("system");
  });
});
