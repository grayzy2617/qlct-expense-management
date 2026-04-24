# QLCT Frontend

Frontend ứng dụng Quản Lý Chi Tiêu được xây dựng bằng React + Vite.

## 🔧 Cài Đặt

### Yêu cầu
- Node.js 16+
- npm hoặc yarn

### Cấu Hình

1. **Clone repository**
```bash
git clone <your-frontend-repo-url>
cd my-frontend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình môi trường**
   - Copy file `.env.example` thành `.env`
   - Cập nhật `VITE_API_BASE_URL` nếu backend chạy ở port khác

4. **Chạy ứng dụng**
```bash
npm run dev
```

## 🛠️ Technology Stack

- React + Vite
- Tailwind CSS
- Axios
- React Router

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Kiểm tra code với ESLint

---

## Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
