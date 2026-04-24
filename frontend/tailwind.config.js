/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FDB813", // Màu vàng đậm, dễ nhìn hơn
        primaryHover: "#FFA500", // Cam vàng cho hover
        dark: "#0F0F0F", // Màu nền tối
        card: "#1A1A1A", // Màu card tối nhưng có độ tương phản
        cardHover: "#252525", // Màu card khi hover
        danger: "#FF5252",
        success: "#4CAF50",
        textPrimary: "#FFFFFF", // Text chính màu trắng
        textSecondary: "#B0B0B0", // Text phụ màu xám sáng
      },
    },
  },
  plugins: [],
};
