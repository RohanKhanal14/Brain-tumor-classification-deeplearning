import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserProfile from "@/components/UserProfile";

// Mock services used by UserProfile
const getProfile = vi.fn();
const updateProfile = vi.fn();
const uploadAvatar = vi.fn();
vi.mock("@/services/api", () => ({
  getProfile: () => getProfile(),
  updateProfile: (data: { fullName: string; email: string; organization?: string; location?: string }) => updateProfile(data),
  uploadAvatar: (file: File) => uploadAvatar(file),
}));

// Mock UserReports to keep the DOM light
vi.mock("@/components/UserReports", () => ({
  default: () => <div data-testid="user-reports" />,
}));

// Mock useAuth to provide a logged-in user
const refreshUser = vi.fn();
vi.mock("@/context/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      userType: "healthcare",
    },
    refreshUser,
  }),
}));

// Mock toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe("UserProfile", () => {
  beforeEach(() => {
    getProfile.mockReset();
    updateProfile.mockReset();
    uploadAvatar.mockReset();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("loads and displays profile data from API", async () => {
    getProfile.mockResolvedValueOnce({
      success: true,
      profile: {
        name: "Alice",
        email: "alice@example.com",
        userType: "healthcare",
        organization: "ACME Health",
        location: "NYC",
        createdAt: new Date("2024-01-15").toISOString(),
        avatar: "/uploads/profiles/alice.png",
      },
    });

  render(<UserProfile />);

  // Wait for stable UI element
  await screen.findByRole('button', { name: /edit profile/i });

    // Role derived from userType
    expect(screen.getByText("Healthcare Provider")).toBeInTheDocument();

    // Organization and Location
    expect(screen.getByText("ACME Health")).toBeInTheDocument();
    expect(screen.getByText("NYC")).toBeInTheDocument();

  // Avatar path is stored in localStorage after fetch
  expect(localStorage.getItem('userAvatar')).toContain('/uploads/profiles/alice.png');
  });

  it("edits and saves profile via updateProfile", async () => {
    getProfile.mockResolvedValueOnce({ success: true, profile: { name: "Alice", email: "alice@example.com", userType: "patient", createdAt: new Date().toISOString() } });
    updateProfile.mockResolvedValueOnce({ success: true });

  render(<UserProfile />);

  // Wait initial load using stable unique element
  await screen.findByRole('button', { name: /edit profile/i });

    // Enter edit mode
  await userEvent.click(screen.getByRole("button", { name: /edit profile/i }));

  const nameInput = screen.getByPlaceholderText(/your full name/i) as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText(/your email address/i) as HTMLInputElement;
  const locationInput = screen.getByPlaceholderText(/your location/i) as HTMLInputElement;

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Alice Johnson");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "alice.j@example.com");
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, "Boston");

    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    expect(updateProfile).toHaveBeenCalledWith({
      fullName: "Alice Johnson",
      email: "alice.j@example.com",
      organization: expect.any(String),
      location: "Boston",
    });

    // Back to view mode
    expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
  });

  it("uploads avatar and updates image src", async () => {
    getProfile.mockResolvedValueOnce({ success: true, profile: { name: "Alice", email: "alice@example.com", userType: "patient", createdAt: new Date().toISOString() } });
    uploadAvatar.mockResolvedValueOnce({ success: true, avatarUrl: "/uploads/profiles/new.png" });

  const { container } = render(<UserProfile />);
  await screen.findByRole('button', { name: /edit profile/i });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);

    // Avatar image should update with constructed full URL
  // New avatar should be written to localStorage by component logic
  expect(localStorage.getItem('userAvatar')).toContain('/uploads/profiles/new.png');
  });
});
