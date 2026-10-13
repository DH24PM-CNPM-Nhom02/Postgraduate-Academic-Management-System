# Mô tả hệ thống quản lý quá trình đào tạo nghiên cứu sinh

## 1. Tổng quan hệ thống

Hệ thống Quản lý Học vụ Sau đại học – Phân hệ Đào tạo Tiến sĩ là một ứng dụng web phục vụ việc quản lý hồ sơ nghiên cứu sinh (NCS), giảng viên hướng dẫn (GVHD) và theo dõi tiến trình đào tạo tiến sĩ tại Trường Đại học An Giang. Mục tiêu chính của hệ thống là số hóa việc nộp, tiếp nhận và xét duyệt minh chứng học vụ theo từng mốc đào tạo, giúp NCS chủ động theo dõi tình trạng học tập của mình, đồng thời giúp giáo vụ quản lý hồ sơ và kiểm soát tiến độ đào tạo tập trung trên một hệ thống thống nhất.

Hệ thống chỉ tập trung vào đào tạo tiến sĩ, không triển khai các chức năng quản lý học viên cao học hoặc các bậc đào tạo khác. Định hướng thiết kế là giữ quy trình nghiệp vụ đơn giản, dễ sử dụng và bám sát nhu cầu thực tế. Trọng tâm không phải là xây dựng một hệ thống tự động hóa toàn bộ quy trình hành chính, mà là quản lý dữ liệu, minh chứng, trạng thái xử lý và tiến trình đào tạo của từng NCS một cách rõ ràng, có kiểm soát.

## 2. Quản lý tài khoản và phân quyền

Hệ thống có chức năng xác thực tài khoản, quản lý thông tin người dùng và phân quyền truy cập theo vai trò. Người dùng chính bao gồm NCS, giáo vụ, giảng viên hướng dẫn và quản trị viên; các quyền cụ thể được xác định theo nghiệp vụ thực tế mà từng vai trò được phép thực hiện.

Mỗi tài khoản có thông tin nhận diện, tên người dùng, mật khẩu, trạng thái hoạt động và các vai trò được gán. Hệ thống cần hỗ trợ quản lý phiên đăng nhập, khóa hoặc vô hiệu hóa tài khoản khi cần thiết và giới hạn quyền truy cập dữ liệu theo vai trò. NCS có thể xem và cập nhật những thông tin hồ sơ được phép chỉnh sửa, đồng thời quản lý các thông tin tài khoản cá nhân theo quy định. Các dữ liệu nghiệp vụ như trạng thái mốc đào tạo, kết quả duyệt minh chứng và thông tin quyết định không được xem là dữ liệu hồ sơ cá nhân có thể tự ý thay đổi.

## 3. Quản lý hồ sơ nghiên cứu sinh

Mỗi NCS có một hồ sơ đào tạo riêng, được liên kết với tài khoản đăng nhập. Hồ sơ lưu trữ các thông tin cần thiết cho việc quản lý quá trình đào tạo, chẳng hạn như mã số học viên, họ tên, khóa tuyển sinh, thông tin liên hệ, chương trình hoặc thời gian đào tạo, đề tài luận án, giảng viên hướng dẫn và trạng thái học tập. Những trường dữ liệu cụ thể cần căn cứ vào mô hình dữ liệu và yêu cầu nghiệp vụ đang triển khai.

NCS có thể xem hồ sơ cá nhân, thông tin đề tài, GVHD được phân công, tiến trình đào tạo và trạng thái tốt nghiệp. Giáo vụ có thể tra cứu, quản lý và cập nhật hồ sơ theo quyền được cấp. Hệ thống cũng cần hỗ trợ tìm kiếm, lọc danh sách NCS theo các tiêu chí phù hợp như mã số, họ tên, khóa tuyển sinh, GVHD và trạng thái đào tạo để phục vụ công tác quản lý.

## 4. Quản lý tiến trình đào tạo theo 8 mốc

Tiến trình đào tạo của NCS được tổ chức thành 8 mốc nghiệp vụ chính, không tính mốc nhập học. Mỗi mốc đại diện cho một giai đoạn hoặc yêu cầu cần hoàn thành trong quá trình học tiến sĩ. Các mốc được hiển thị theo trình tự trên giao diện để NCS dễ dàng nhận biết mình đang ở giai đoạn nào, đã hoàn thành những nội dung nào và còn những yêu cầu nào chưa được duyệt.

Mỗi mốc có trạng thái xử lý riêng, chẳng hạn như chưa mở khóa, đang chờ nộp minh chứng, chờ giáo vụ duyệt, đã được duyệt hoặc bị từ chối. Tên trạng thái và cách biểu diễn trên giao diện có thể được điều chỉnh theo thiết kế hiện tại, nhưng phải phân biệt rõ tình trạng của mốc với tình trạng của một lần nộp minh chứng.

Hệ thống áp dụng nguyên tắc mở khóa tuần tự: NCS chỉ được thực hiện mốc tiếp theo khi mốc trước đó đã đáp ứng điều kiện hoàn thành, trong đó điều kiện cốt lõi là minh chứng của mốc trước đã được giáo vụ phê duyệt. Khi một mốc được duyệt, hệ thống cập nhật trạng thái và cho phép NCS tiếp tục mốc kế tiếp. Nếu minh chứng bị từ chối, mốc chưa được xem là hoàn thành; NCS cần xem lý do từ chối, bổ sung hoặc thay thế minh chứng rồi gửi lại theo quy trình được hỗ trợ.

Việc khóa và mở khóa phải được kiểm tra ở backend, không chỉ ẩn hoặc vô hiệu hóa nút trên giao diện. Hệ thống không được cho phép NCS gọi API trực tiếp để nộp minh chứng cho mốc chưa đủ điều kiện. Tuy nhiên, không nên tự động thêm các bước xét duyệt, hội đồng hoặc điều kiện học vụ phức tạp nếu nghiệp vụ hiện tại chưa yêu cầu.

## 5. Nộp và xét duyệt minh chứng

Đây là nghiệp vụ trung tâm của toàn hệ thống. Tại mỗi mốc được mở khóa, NCS có thể tải lên các tệp minh chứng tương ứng với yêu cầu của mốc đó. Minh chứng có thể là báo cáo, biên bản, biểu mẫu hoặc tài liệu học vụ được quy định. Hệ thống cần lưu thông tin tệp, người nộp, mốc liên quan, thời điểm nộp, trạng thái xử lý và lịch sử các lần nộp khi cần thiết.

Sau khi NCS gửi minh chứng, giáo vụ có thể xem thông tin hồ sơ, truy cập tệp minh chứng và đưa ra một trong hai kết quả chính: phê duyệt hoặc từ chối. Khi phê duyệt, mốc được đánh dấu hoàn thành nếu đáp ứng các điều kiện nghiệp vụ và mốc kế tiếp được mở khóa. Khi từ chối, giáo vụ cần cung cấp lý do để NCS biết nội dung cần chỉnh sửa hoặc bổ sung. NCS có thể theo dõi kết quả xét duyệt và gửi lại minh chứng theo quy định.

Hệ thống cần phân biệt việc tải tệp lên với việc gửi minh chứng để xét duyệt. Tệp đã tải lên nhưng chưa được gửi không mặc nhiên được xem là hồ sơ đã nộp. Tương tự, minh chứng đang chờ duyệt hoặc bị từ chối không được coi là minh chứng đã đạt. Mọi thao tác duyệt, từ chối và nộp lại cần cập nhật trạng thái nhất quán để NCS và giáo vụ nhìn thấy cùng một kết quả.

Nếu một mốc có nhiều loại minh chứng, hệ thống có thể quản lý nhiều tệp hoặc nhiều mục minh chứng trong cùng mốc, tùy theo mô hình dữ liệu thực tế. Không nên mặc định mỗi mốc chỉ có một tệp duy nhất nếu yêu cầu nghiệp vụ chưa xác định như vậy.

## 6. Quản lý giảng viên hướng dẫn

Hệ thống quản lý danh sách giảng viên có thể tham gia hướng dẫn NCS, bao gồm thông tin nhận diện, học hàm, học vị, chuyên môn, đơn vị công tác và các thông tin cần thiết khác theo phạm vi triển khai. Mỗi NCS có thể được liên kết với một hoặc nhiều GVHD tùy theo quyết định phân công và quy định đào tạo.

Thông tin GVHD phải được liên kết với hồ sơ NCS để phục vụ tra cứu và theo dõi. Hệ thống cần hỗ trợ xem danh sách NCS mà từng giảng viên đang hướng dẫn, quản lý thông tin phân công và hạn chế tình trạng dữ liệu GVHD bị nhập lặp hoặc không nhất quán. Nếu hệ thống có quản lý khoa, bộ môn hoặc phòng ban, các đơn vị nên được biểu diễn bằng dữ liệu có quan hệ thay vì chỉ lưu tên đơn vị dưới dạng chuỗi tự do.

Các quy tắc về số lượng NCS tối đa mà một GVHD được hướng dẫn có thể được bổ sung nếu nằm trong phạm vi triển khai đã thống nhất. Không nên tự động khóa việc phân công hoặc triển khai toàn bộ nghiệp vụ quản lý lý lịch khoa học, định mức hướng dẫn nếu các chức năng này chưa được xác nhận là yêu cầu bắt buộc của phiên bản hiện tại.

## 7. Đề nghị thay đổi đề tài và gia hạn đào tạo

NCS có thể tạo đề nghị thay đổi đề tài luận án hoặc đề nghị gia hạn thời gian đào tạo thông qua hệ thống. Mỗi đề nghị cần lưu loại đề nghị, nội dung, lý do, thời điểm gửi, người gửi, trạng thái xử lý và các tài liệu đính kèm nếu có.

Các đề nghị cần có trạng thái rõ ràng, chẳng hạn như đã gửi, đang chờ xử lý, được chấp thuận hoặc bị từ chối. Giáo vụ hoặc người có thẩm quyền được phân công có thể xem nội dung đề nghị, ghi nhận kết quả xử lý và cung cấp lý do khi từ chối. NCS có thể theo dõi tiến độ và kết quả đề nghị của mình.

Cần phân biệt giữa việc gửi đề nghị và việc thay đổi dữ liệu chính thức. Ví dụ, việc NCS gửi đề nghị thay đổi đề tài không đồng nghĩa với việc đề tài hiện tại được thay đổi ngay. Chỉ khi đề nghị được chấp thuận theo quy trình áp dụng thì thông tin chính thức mới được cập nhật. Tương tự, việc gửi đề nghị gia hạn không tự động làm thay đổi thời hạn đào tạo. Hệ thống cần lưu được trạng thái và kết quả xử lý để tránh nhầm lẫn giữa đề xuất của NCS và quyết định đã có hiệu lực.

## 8. Theo dõi trạng thái tốt nghiệp

NCS có thể xem trạng thái tốt nghiệp hoặc trạng thái hoàn thành chương trình đào tạo của mình trên hệ thống. Giáo vụ có thể quản lý, cập nhật và tra cứu thông tin liên quan theo quyền hạn. Trạng thái này cần được phân biệt với trạng thái của từng mốc đào tạo: hoàn thành các mốc không nhất thiết đồng nghĩa với việc đã đủ điều kiện tốt nghiệp nếu còn các yêu cầu khác theo quy định.

Hệ thống nên thể hiện rõ tình trạng hiện tại và các yêu cầu còn thiếu khi dữ liệu nghiệp vụ đã có đủ thông tin để xác định. Tuy nhiên, không được tự suy diễn rằng NCS đủ điều kiện tốt nghiệp chỉ dựa trên việc đã hoàn thành 8 mốc nếu những điều kiện bổ sung chưa được xác nhận hoặc chưa được quản lý trong hệ thống. Nếu phiên bản hiện tại chưa tự động xét tốt nghiệp, trạng thái cần do người có thẩm quyền cập nhật hoặc xác nhận theo quy trình đã thống nhất.

## 9. Vai trò của giáo vụ và quản trị viên

Giáo vụ là vai trò chịu trách nhiệm chính trong việc tiếp nhận và xét duyệt minh chứng, quản lý hồ sơ NCS, theo dõi tiến trình đào tạo, xử lý các đề nghị và cập nhật những thông tin học vụ được phân quyền. Giao diện dành cho giáo vụ cần tập trung vào danh sách hồ sơ cần xử lý, trạng thái từng mốc, minh chứng đang chờ duyệt, các hồ sơ bị từ chối và các đề nghị đang chờ giải quyết.

Quản trị viên chịu trách nhiệm quản lý tài khoản, vai trò, quyền truy cập và các cấu hình kỹ thuật cần thiết. Quản trị viên không mặc nhiên thay thế vai trò nghiệp vụ của giáo vụ trong việc duyệt minh chứng. Việc phân quyền cần được kiểm tra ở backend để bảo đảm người dùng chỉ thực hiện được các thao tác thuộc phạm vi trách nhiệm của mình.

## 10. Kiến trúc và công nghệ

Hệ thống được định hướng phát triển theo mô hình frontend và backend tách biệt. Frontend sử dụng Next.js để xây dựng giao diện người dùng. Backend sử dụng NestJS theo kiến trúc microservices, trong đó các service phụ trách những nhóm nghiệp vụ riêng biệt. MariaDB/MySQL kết hợp Prisma được sử dụng để quản lý dữ liệu quan hệ, tài khoản, hồ sơ NCS, GVHD, tiến trình và các dữ liệu nghiệp vụ có quan hệ với nhau.

Service xác thực chịu trách nhiệm về tài khoản, đăng nhập, phiên làm việc, vai trò và quyền truy cập. Các service nghiệp vụ quản lý hồ sơ NCS, GVHD, tiến trình đào tạo, minh chứng và đề nghị học vụ theo ranh giới đã được thiết kế trong mã nguồn. Việc giao tiếp giữa các service có thể sử dụng NestJS microservice transport, bao gồm TCP theo cấu hình hiện tại của dự án.

Tệp minh chứng cần được quản lý tách biệt về mặt logic với dữ liệu hồ sơ. Cơ sở dữ liệu lưu metadata và quan hệ giữa tệp, NCS, mốc đào tạo và lần nộp; nội dung tệp có thể được lưu bằng cơ chế lưu trữ phù hợp với kiến trúc triển khai. Khi thiết kế hoặc sửa code, cần kiểm tra các Prisma schema, DTO, controller, service và API contract hiện có trước khi quyết định thêm bảng hoặc thay đổi quan hệ.

## 11. Nguyên tắc phát triển và giới hạn nghiệp vụ

Hệ thống phải ưu tiên luồng nghiệp vụ cốt lõi: NCS xem tiến trình, nộp minh chứng; giáo vụ xem minh chứng, duyệt hoặc từ chối; hệ thống cập nhật trạng thái và mở khóa mốc tiếp theo khi đủ điều kiện. Các chức năng quản lý hồ sơ, GVHD, đề nghị thay đổi đề tài, gia hạn và trạng thái tốt nghiệp bổ trợ cho luồng cốt lõi này.

Không tự ý biến hệ thống thành một nền tảng quản lý toàn bộ quy trình đào tạo tiến sĩ với nhiều tầng phê duyệt, hội đồng, phản biện kín, biểu mẫu đánh giá và điều kiện tự động phức tạp nếu những phần đó chưa nằm trong phạm vi phiên bản hiện tại. SRS có thể mô tả các yêu cầu mở rộng hoặc nghiệp vụ theo quy định đào tạo, nhưng việc triển khai thực tế phải tuân theo phạm vi đã thống nhất và tình trạng mã nguồn hiện có.

Khi hỗ trợ phát triển dự án, AI Agent phải giữ nguyên các công nghệ, quy ước đặt tên, cấu trúc thư mục, mô hình dữ liệu và cách giao tiếp giữa các service đang được sử dụng. Trước khi đề xuất thay đổi schema hoặc API, cần kiểm tra cấu trúc hiện tại và xác định tác động đến các service liên quan. Ưu tiên giải pháp đơn giản, nhất quán, có thể kiểm thử và không làm phát sinh nghiệp vụ ngoài yêu cầu. Nếu một quy tắc chưa được xác định rõ, cần nêu đó là điểm cần xác nhận thay vì tự đặt ra quy tắc mới.

Tóm lại, đây là hệ thống quản lý học vụ tiến sĩ tập trung vào hồ sơ NCS, GVHD, tiến trình đào tạo theo 8 mốc chính, quy trình nộp và xét duyệt minh chứng, quản lý đề nghị học vụ và theo dõi trạng thái tốt nghiệp. Giá trị cốt lõi của hệ thống là giúp NCS biết mình cần thực hiện gì và đang ở trạng thái nào, đồng thời giúp giáo vụ quản lý, kiểm tra và xác nhận hồ sơ tập trung, minh bạch và nhất quán.
