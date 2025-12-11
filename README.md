# Phân tích kỹ thuật: Bảng tổng sắp huy chương SEA Games 33

## 1. Phân tích bài toán
Yêu cầu xây dựng một ứng dụng hiển thị bảng xếp hạng huy chương tự động cập nhật từ nguồn dữ liệu API thực tế.

### Thách thức kỹ thuật
1.  **CORS (Cross-Origin Resource Sharing):** Đây là vấn đề lớn nhất. Trình duyệt sẽ chặn request từ `localhost` hoặc domain khác gọi trực tiếp vào API `wrs.gmsmate.com` nếu server không cho phép `Access-Control-Allow-Origin: *`.
    *   *Giải pháp:* Code được thiết kế để thử fetch dữ liệu thật. Nếu thất bại (do CORS hoặc lỗi mạng), hệ thống sẽ tự động chuyển sang chế độ "Giả lập" (Simulation Mode) với dữ liệu mẫu chính xác để đảm bảo UI không bị vỡ.
2.  **Cấu trúc dữ liệu:** API trả về dạng phân trang (`page=1&limit=10`). Cần phải map đúng các trường JSON (thường là `noc_name`, `gold`, `silver`, `bronze`) vào TypeScript interface.
3.  **Performance:** Việc cập nhật 5 phút/lần là tần suất thấp, không gây tải cho client. Tuy nhiên cần xử lý `setInterval` đúng cách trong React `useEffect` để tránh memory leak.

## 2. Giải pháp kiến trúc
*   **State Management:** Sử dụng React `useState` để lưu danh sách huy chương và trạng thái loading/error.
*   **Polling:** Sử dụng `setInterval` với chu kỳ 300,000ms (5 phút).
*   **Styling:** Tailwind CSS cho giao diện mobile-first. Sử dụng màu sắc đặc trưng (Vàng/Bạc/Đồng) để làm nổi bật top 3.
*   **Fallback:** Mock data bao gồm các nước tham gia SEA Games: Vietnam, Thailand, Indonesia, Malaysia, Philippines, Singapore, Cambodia, Myanmar, Laos, Brunei, Timor-Leste.
