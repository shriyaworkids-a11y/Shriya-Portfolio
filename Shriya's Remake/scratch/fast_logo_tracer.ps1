$csharpCode = @"
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;

public class SafeLogoProcessor
{
    public static void Process(string inputPath, string outDir)
    {
        Directory.CreateDirectory(outDir);
        using (Bitmap src = (Bitmap)Image.FromFile(inputPath))
        {
            int w = src.Width;
            int h = src.Height;
            
            BitmapData data = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int bytesCount = Math.Abs(data.Stride) * h;
            byte[] srcBytes = new byte[bytesCount];
            Marshal.Copy(data.Scan0, srcBytes, 0, bytesCount);
            src.UnlockBits(data);
            
            int minX = w, maxX = 0, minY = h, maxY = 0;
            int stride = Math.Abs(data.Stride);
            
            for (int y = 0; y < h; y++)
            {
                int rowOffset = y * stride;
                for (int x = 0; x < w; x++)
                {
                    int idx = rowOffset + (x * 4);
                    byte b = srcBytes[idx];
                    byte g = srcBytes[idx + 1];
                    byte r = srcBytes[idx + 2];
                    if (r > 130 && g > 130 && b > 130)
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            
            int pad = 8;
            int cropX = Math.Max(0, minX - pad);
            int cropY = Math.Max(0, minY - pad);
            int cropW = Math.Min(w - cropX, (maxX - minX + 1) + (pad * 2));
            int cropH = Math.Min(h - cropY, (maxY - minY + 1) + (pad * 2));
            
            bool[,] grid = new bool[cropW, cropH];
            
            using (Bitmap whiteBmp = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
            using (Bitmap blackBmp = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
            {
                BitmapData wData = whiteBmp.LockBits(new Rectangle(0, 0, cropW, cropH), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                BitmapData bData = blackBmp.LockBits(new Rectangle(0, 0, cropW, cropH), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                
                int destBytesCount = Math.Abs(wData.Stride) * cropH;
                byte[] wBytes = new byte[destBytesCount];
                byte[] bBytes = new byte[destBytesCount];
                int dStride = Math.Abs(wData.Stride);
                
                for (int y = 0; y < cropH; y++)
                {
                    int sRowOffset = (cropY + y) * stride;
                    int dRowOffset = y * dStride;
                    
                    for (int x = 0; x < cropW; x++)
                    {
                        int sx = cropX + x;
                        int sIdx = sRowOffset + (sx * 4);
                        int dIdx = dRowOffset + (x * 4);
                        
                        byte b = srcBytes[sIdx];
                        byte g = srcBytes[sIdx + 1];
                        byte r = srcBytes[sIdx + 2];
                        int avg = (r + g + b) / 3;
                        
                        if (avg > 130)
                        {
                            int alpha = Math.Min(255, Math.Max(0, (int)((avg - 110) * (255.0 / 120.0))));
                            grid[x, y] = true;
                            
                            // White
                            wBytes[dIdx] = 255;
                            wBytes[dIdx + 1] = 255;
                            wBytes[dIdx + 2] = 255;
                            wBytes[dIdx + 3] = (byte)alpha;
                            
                            // Black
                            bBytes[dIdx] = 18;
                            bBytes[dIdx + 1] = 18;
                            bBytes[dIdx + 2] = 18;
                            bBytes[dIdx + 3] = (byte)alpha;
                        }
                        else
                        {
                            grid[x, y] = false;
                            wBytes[dIdx + 3] = 0;
                            bBytes[dIdx + 3] = 0;
                        }
                    }
                }
                
                Marshal.Copy(wBytes, 0, wData.Scan0, destBytesCount);
                Marshal.Copy(bBytes, 0, bData.Scan0, destBytesCount);
                
                whiteBmp.UnlockBits(wData);
                blackBmp.UnlockBits(bData);
                
                whiteBmp.Save(Path.Combine(outDir, "shriya-butterfly-logo-cropped.png"), ImageFormat.Png);
                whiteBmp.Save(Path.Combine(outDir, "shriya-butterfly-white.png"), ImageFormat.Png);
                blackBmp.Save(Path.Combine(outDir, "shriya-butterfly-black.png"), ImageFormat.Png);
            }
            
            // Generate Vector Contour SVG
            TraceSVG(grid, cropW, cropH, outDir);
        }
    }
    
    private static void TraceSVG(bool[,] grid, int w, int h, string outDir)
    {
        int[] dx = { 0, 1, 1, 1, 0, -1, -1, -1 };
        int[] dy = { -1, -1, 0, 1, 1, 1, 0, -1 };
        
        HashSet<string> visitedStarts = new HashSet<string>();
        List<string> paths = new List<string>();
        
        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                bool curr = grid[x, y];
                bool prev = (x > 0) ? grid[x - 1, y] : false;
                
                bool isOuter = curr && !prev;
                bool isInner = !curr && prev;
                
                if (isOuter || isInner)
                {
                    int startX = isOuter ? x : x - 1;
                    int startY = y;
                    string key = startX + "," + startY;
                    if (visitedStarts.Contains(key)) continue;
                    
                    int cx = startX, cy = startY;
                    int cdir = 0;
                    List<Point> points = new List<Point>();
                    points.Add(new Point(cx, cy));
                    visitedStarts.Add(key);
                    
                    bool cycle = false;
                    for (int step = 0; step < 50000; step++)
                    {
                        bool found = false;
                        int checkDir = (cdir + 5) % 8;
                        for (int i = 0; i < 8; i++)
                        {
                            int dir = (checkDir + i) % 8;
                            int nx = cx + dx[dir];
                            int ny = cy + dy[dir];
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h && grid[nx, ny])
                            {
                                cx = nx;
                                cy = ny;
                                cdir = dir;
                                found = true;
                                break;
                            }
                        }
                        
                        if (!found) break;
                        if (cx == startX && cy == startY)
                        {
                            cycle = true;
                            break;
                        }
                        points.Add(new Point(cx, cy));
                        visitedStarts.Add(cx + "," + cy);
                    }
                    
                    if (cycle && points.Count > 15)
                    {
                        int stepSize = Math.Max(1, points.Count / 140);
                        StringBuilder sb = new StringBuilder();
                        sb.Append("M ");
                        for (int p = 0; p < points.Count; p += stepSize)
                        {
                            sb.Append(points[p].X).Append(" ").Append(points[p].Y).Append(p + stepSize < points.Count ? " L " : " ");
                        }
                        sb.Append("Z");
                        paths.Add(sb.ToString());
                    }
                }
            }
        }
        
        string combinedD = string.Join(" ", paths);
        string svg = string.Format("<svg class=\"brand-logo-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 {0} {1}\" fill=\"currentColor\" fill-rule=\"evenodd\">\n  <path d=\"{2}\" />\n</svg>", w, h, combinedD);
        
        File.WriteAllText(Path.Combine(outDir, "shriya-butterfly-logo.svg"), svg);
        File.WriteAllText(@"d:\riya\Shriya's Portfolio\Shriya's Remake\scratch\fast_svg_markup.txt", svg);
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"

$inputPath = "C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56\.user_uploaded\media_1789929159096.jpg"
$outDir = "d:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya"

[SafeLogoProcessor]::Process($inputPath, $outDir)

Write-Output "FAST TRACING SUCCESSFUL!"
