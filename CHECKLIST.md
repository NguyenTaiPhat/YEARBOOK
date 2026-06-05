# ✅ Checklist Trước Khi Deploy

## 📋 Chuẩn Bị

- [x] Xóa các file test không cần thiết
- [x] Xóa thư mục `.next` build artifacts
- [x] Tạo file `.env.example`
- [x] Cập nhật `.gitignore`
- [x] Cập nhật `README.md` với hướng dẫn deploy
- [x] Tạo `vercel.json` configuration
- [x] Test build local thành công
- [ ] **ĐỌC FILE `DEPLOYMENT.md` ĐỂ BIẾT CÁCH DEPLOY**

## 🔑 Environment Variables Cần Có

Đảm bảo bạn có các giá trị này từ file `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_DRIVE_API_KEY
GOOGLE_DRIVE_FOLDER_ID
NEXT_PUBLIC_SITE_URL
```

## 🚀 Các Bước Deploy (Tóm Tắt)

### 1. Google Drive Setup
- [ ] Folder được share "Anyone with the link"
- [ ] Role là "Viewer"
- [ ] Copy đúng Folder ID

### 2. Git & GitHub
- [ ] Khởi tạo git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Ready for deployment"`
- [ ] Tạo repository trên GitHub
- [ ] Add remote: `git remote add origin <url>`
- [ ] Push: `git push -u origin main`

### 3. Vercel Deployment
- [ ] Vào [vercel.com/new](https://vercel.com/new)
- [ ] Import repository từ GitHub
- [ ] Thêm TẤT CẢ environment variables
- [ ] Click Deploy
- [ ] Đợi build xong (~2-3 phút)

### 4. Post-Deploy Configuration
- [ ] Copy production URL từ Vercel
- [ ] Update `NEXT_PUBLIC_SITE_URL` trong Vercel env variables
- [ ] Cập nhật Supabase Redirect URLs
- [ ] Redeploy project

### 5. Testing
- [ ] Mở production URL
- [ ] Check ảnh từ Google Drive
- [ ] Test Supabase connection (submit memory, signature)
- [ ] Test dark mode
- [ ] Test music player
- [ ] Test responsive trên mobile

## ⚠️ Common Issues

### Ảnh không hiển thị
→ Google Drive folder chưa được share publicly

### "Failed to fetch" errors
→ Kiểm tra environment variables trong Vercel

### Build fails
→ Xem build logs trong Vercel Dashboard → Deployments

### Database errors
→ Kiểm tra Supabase credentials và schema

## 📚 Tài Liệu Tham Khảo

- **Deploy Guide**: Đọc file `DEPLOYMENT.md`
- **README**: Xem file `README.md`
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deploy**: https://nextjs.org/docs/deployment

## 🎯 Sau Khi Deploy Xong

- [ ] Chia sẻ link với bạn bè
- [ ] Monitor Vercel dashboard cho errors
- [ ] Kiểm tra Vercel Analytics (optional)
- [ ] Setup custom domain (optional)
- [ ] Enable Vercel Speed Insights (optional)

---

💡 **Tip**: Mỗi lần push code lên GitHub, Vercel sẽ tự động deploy!

```bash
git add .
git commit -m "Update feature"
git push
```

→ Auto deploy! 🚀
