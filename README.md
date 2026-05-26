# MyNote Firebase Web

Website ghi chú skill dùng React + TypeScript + Firebase Authentication + Firestore.

## Chức năng đã có

- Đăng nhập Google bằng Firebase Auth.
- Tự tạo user sau đăng nhập.
- Root/Admin duyệt user, khóa user, đổi role.
- Quản lý Category.
- Quản lý Topic theo Category.
- Quản lý My Notes.
- Note có `mediaLinks[]`: image, video, file, link.
- Public Notes.
- App Settings.
- Firestore Repository tách biệt khỏi UI.
- Responsive desktop/mobile.
- Có file `firestore.rules` mẫu.

## Cấu trúc source

```txt
src/
├── components/       # UI component dùng chung
├── context/          # AuthContext
├── firebase/         # Firebase config, collection names
├── pages/            # Màn hình chính
├── repositories/     # CRUD Firestore, tách khỏi UI
├── services/         # Auth service
├── types/            # Model TypeScript
├── utils/            # slug, searchKeywords, parseTags
├── App.tsx
├── main.tsx
└── styles.css
```

## Cài đặt

```bash
npm install
```

## Cấu hình Firebase

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Điền thông tin Firebase Web App:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ROOT_EMAIL=root@gmail.com
```

## Firebase Console cần bật

1. Authentication → Sign-in method → bật Google.
2. Firestore Database → Create database.
3. Rules → dán nội dung file `firestore.rules`.
4. Indexes: nếu Firestore báo lỗi thiếu index, bấm link Firebase trả về để tạo tự động.

## Chạy local

```bash
npm run dev
```

Mở URL Vite trả về, thường là:

```txt
http://localhost:5173
```

## Build production

```bash
npm run build
```

File build nằm trong:

```txt
dist/
```

## Cách tạo root đầu tiên

- Điền `VITE_ROOT_EMAIL` đúng email Google của root.
- Đăng nhập bằng email đó.
- Website tự tạo user có `role = root`, `status = approved`.
- Các user khác sau khi đăng nhập sẽ ở trạng thái `pending`.
- Root vào menu `Users` để duyệt.

## Lưu ý triển khai thực tế

- Giai đoạn đầu chỉ lưu link media vào `notes.mediaLinks[]`.
- Chưa upload file trực tiếp lên Google Drive.
- Nếu cần chia sẻ note nâng cao theo từng user, nên bổ sung collection `note_shares`.
- Nếu cần full-text search tốt hơn Firestore, nên tích hợp Algolia hoặc Meilisearch.
```
