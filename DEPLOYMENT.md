# 🚀 Hướng Dẫn Deploy Lên Vercel

## Bước 1: Chuẩn Bị

### 1.1. Đảm bảo Google Drive Folder được share công khai

**QUAN TRỌNG**: Nếu không share công khai, ảnh sẽ không hiển thị!

1. Mở folder Google Drive của bạn
2. Click nút **"Share"** (góc trên bên phải)
3. Trong phần **"General access"**:
   - Chọn **"Anyone with the link"**
   - Đảm bảo role là **"Viewer"**
   - Click **"Done"**

### 1.2. Kiểm tra file `.gitignore`

Đảm bảo file `.env.local` không bị commit:

```bash
# Check if .env.local is in .gitignore
type .gitignore | findstr ".env"
```

Nếu không có, thêm vào `.gitignore`:
```
.env*
```

## Bước 2: Push Code Lên GitHub

```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Vercel deployment"

# Add remote repository
git remote add origin https://github.com/NguyenTaiPhat/YEARBOOK.git

# Push
git push -u origin main
```

## Bước 3: Deploy Lên Vercel

### Cách 1: Qua Vercel Dashboard (Recommended)

1. Đi tới [vercel.com/new](https://vercel.com/new)
2. Login với GitHub
3. Click **"Import Project"**
4. Chọn repository `our-memories`
5. Vercel sẽ tự động phát hiện Next.js framework
6. Bước quan trọng: **Thêm Environment Variables**

### Thêm Environment Variables

Trong phần "Environment Variables", thêm:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
GOOGLE_DRIVE_API_KEY = your_google_drive_api_key
GOOGLE_DRIVE_FOLDER_ID = your_google_drive_folder_id
NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
```

**Lưu ý**: 
- Copy giá trị từ file `.env.local` local của bạn
- `NEXT_PUBLIC_SITE_URL` sẽ là URL Vercel cung cấp (ví dụ: `https://our-memories.vercel.app`)

7. Click **"Deploy"**
8. Đợi 2-3 phút để build và deploy

### Cách 2: Qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy production
vercel --prod
```

Khi chạy lần đầu, Vercel CLI sẽ hỏi:
- Link to existing project? **N**
- What's your project's name? **our-memories**
- In which directory is your code located? **./` (press Enter)

Sau đó thêm environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_DRIVE_API_KEY
vercel env add GOOGLE_DRIVE_FOLDER_ID
vercel env add NEXT_PUBLIC_SITE_URL
```

## Bước 4: Cập Nhật NEXT_PUBLIC_SITE_URL

Sau khi deploy xong, Vercel sẽ cho bạn một URL (ví dụ: `https://our-memories.vercel.app`)

1. Vào **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
2. Tìm `NEXT_PUBLIC_SITE_URL`
3. Sửa giá trị thành URL production của bạn
4. Click **"Save"**
5. Redeploy: **Deployments** → Click **"..."** → **"Redeploy"**

## Bước 5: Cập Nhật Supabase URLs

Trong Supabase Dashboard:

1. Vào **Authentication** → **URL Configuration**
2. Thêm Vercel URL vào **Site URL**:
   ```
   https://our-memories.vercel.app
   ```
3. Thêm vào **Redirect URLs**:
   ```
   https://our-memories.vercel.app/**
   ```

## Bước 6: Kiểm Tra Deployment

1. Mở URL production của bạn
2. Check Console (F12) xem có errors không
3. Kiểm tra:
   - ✅ Ảnh từ Google Drive hiển thị
   - ✅ Supabase connection hoạt động
   - ✅ Music player chạy
   - ✅ Dark mode toggle
   - ✅ Memory wall submit

## 🔧 Troubleshooting

### Ảnh không hiển thị

1. **Check Google Drive folder permissions**
   - Folder PHẢI được share "Anyone with the link"
   - Role phải là "Viewer"

2. **Check GOOGLE_DRIVE_API_KEY**
   - Đảm bảo API key đúng trong Vercel env variables
   - Google Drive API đã được enable trong Google Cloud Console

3. **Check GOOGLE_DRIVE_FOLDER_ID**
   - Copy đúng folder ID từ URL Google Drive

### Build fails

1. **Check tất cả environment variables**
   - Đảm bảo không có typo
   - Không có khoảng trắng thừa
   - Không có quotes thừa

2. **Check build logs**
   - Vào Vercel Dashboard → Deployments → Click deployment → View Build Logs
   - Tìm error message

3. **Test local build**
   ```bash
   npm run build
   npm start
   ```

### Database errors

1. **Check Supabase credentials**
   - URL đúng format
   - Keys không bị copy nhầm

2. **Check database schema**
   - Đã chạy SQL trong `src/lib/supabase/schema.sql` chưa?

## 🎯 Tips

### Custom Domain

1. Mua domain (ví dụ: namadomain.com, GoDaddy)
2. Vào Vercel Project → **Settings** → **Domains**
3. Add custom domain
4. Cập nhật DNS records theo hướng dẫn Vercel
5. Đợi DNS propagate (5-30 phút)

### Auto Deploy on Git Push

Vercel tự động deploy mỗi khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

→ Vercel sẽ tự động build và deploy!

### Environment Variables cho Dev/Preview/Production

- **Development**: Local `.env.local`
- **Preview**: Deploy từ branch khác `main`
- **Production**: Deploy từ branch `main`

Bạn có thể set environment variables khác nhau cho từng environment trong Vercel Dashboard.

## ✅ Checklist Deploy

- [ ] Google Drive folder shared publicly
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables added
- [ ] First deployment successful
- [ ] NEXT_PUBLIC_SITE_URL updated to production URL
- [ ] Supabase URLs updated
- [ ] Re-deployed after URL update
- [ ] Tested all features on production
- [ ] Images loading correctly
- [ ] Database connections working
- [ ] Music playing
- [ ] Forms submitting

---

🎉 **Chúc mừng! Website đã online!**
