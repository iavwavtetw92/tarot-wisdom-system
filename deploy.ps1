# 一键部署脚本
# 使用方法: .\deploy.ps1 "提交信息"

param(
    [string]$CommitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host "🚀 开始部署塔罗智慧系统..." -ForegroundColor Cyan
Write-Host ""

# 检查Git状态
Write-Host "📋 检查修改..." -ForegroundColor Yellow
git status

Write-Host ""
$continue = Read-Host "是否继续部署? (y/n)"
if ($continue -ne 'y') {
    Write-Host "❌ 部署取消" -ForegroundColor Red
    exit
}

# 添加所有修改
Write-Host ""
Write-Host "📦 添加文件..." -ForegroundColor Yellow
git add .

# 提交
Write-Host "💾 提交修改..." -ForegroundColor Yellow
git commit -m $CommitMessage

# 推送到GitHub
Write-Host "☁️  推送到GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "🌐 Vercel将自动检测并部署（约30秒）" -ForegroundColor Green
Write-Host ""
Write-Host "📊 查看部署状态: https://vercel.com" -ForegroundColor Cyan
