export interface Blog {
    id: number;
    title: string;
    thumbnail: string;
    summary: string;
    content: string;
    createdAt: string;
}

export const staticBlogs: Blog[] = [
    {
        id: 1,
        title: "Xu Hướng Thời Trang Mùa Hè 2024",
        thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
        summary: "Khám phá những phong cách thời trang nổi bật nhất cho mùa hè năm nay.",
        content: "Mùa hè 2024 đánh dấu sự trở lại của những gam màu rực rỡ và họa tiết nhiệt đới. Các nhà thiết kế hàng đầu thế giới đang tập trung vào chất liệu thân thiện với môi trường như linen và cotton hữu cơ.\n\nĐặc biệt, phong cách Y2K vẫn tiếp tục thống trị với quần ống rộng, áo croptop và phụ kiện bản to. Hãy cùng khám phá chi tiết từng xu hướng và cách phối đồ sao cho thật ấn tượng trong bài viết này.",
        createdAt: "2024-05-10"
    },
    {
        id: 2,
        title: "Bí Quyết Phối Đồ Công Sở Trẻ Trung",
        thumbnail: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop",
        summary: "Hướng dẫn cách mix & match trang phục công sở vừa thanh lịch vừa trẻ trung.",
        content: "Thời trang công sở không nhất thiết phải nhàm chán với những bộ vest đen hay áo sơ mi trắng đơn điệu. Bằng cách kết hợp khéo léo giữa các món đồ cơ bản và phụ kiện nổi bật, bạn hoàn toàn có thể tạo ra phong cách chuyên nghiệp nhưng vẫn đầy cá tính.\n\nMột chiếc blazer màu pastel kết hợp cùng quần culottes và áo thun trơn là một lựa chọn hoàn hảo cho ngày làm việc đầu tuần đầy năng lượng.",
        createdAt: "2024-05-12"
    },
    {
        id: 3,
        title: "Cách Chăm Sóc Áo Len Trong Mùa Đông",
        thumbnail: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop",
        summary: "Giữ cho chiếc áo len yêu thích của bạn luôn bền đẹp như mới với những mẹo nhỏ này.",
        content: "Áo len là một item không thể thiếu trong tủ đồ mùa đông, nhưng việc chăm sóc chúng lại đòi hỏi sự tỉ mỉ. Giặt sai cách có thể khiến áo bị co rút hoặc giãn nhão.\n\nLuôn giặt áo len bằng tay với nước lạnh và dầu gội hoặc sữa tắm dịu nhẹ thay vì bột giặt thông thường. Khi phơi, tuyệt đối không treo lên móc mà hãy trải phẳng trên một chiếc khăn khô để giữ nguyên form dáng ban đầu của áo.",
        createdAt: "2024-05-15"
    }
];
