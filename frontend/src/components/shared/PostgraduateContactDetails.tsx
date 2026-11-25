import { Clock, Mail, MapPin, Phone } from "lucide-react";

const officeEmail = "sdh@agu.edu.vn";

export function PostgraduateContactDetails() {
  return (
    <dl className="space-y-3 leading-relaxed">
      <div className="flex items-start gap-2.5">
        <dt>
          <MapPin className="mt-0.5 size-4 text-[#164E9B]" aria-hidden="true" />
          <span className="sr-only">Địa chỉ</span>
        </dt>
        <dd>Phòng B202, Tòa nhà Hiệu bộ, Số 18 Ung Văn Khiêm, Phường Đông Xuyên, TP. Long Xuyên, Tỉnh An Giang.</dd>
      </div>
      <div className="flex items-start gap-2.5">
        <dt>
          <Phone className="mt-0.5 size-4 text-[#164E9B]" aria-hidden="true" />
          <span className="sr-only">Điện thoại</span>
        </dt>
        <dd>
          <a href="tel:+842966256565" className="font-semibold text-[#164E9B] hover:underline">(0296) 6256565</a>
          {" (Số máy lẻ 1042)"}
        </dd>
      </div>
      <div className="flex items-start gap-2.5">
        <dt>
          <Mail className="mt-0.5 size-4 text-[#164E9B]" aria-hidden="true" />
          <span className="sr-only">Email</span>
        </dt>
        <dd><a href={`mailto:${officeEmail}`} className="font-semibold text-[#164E9B] hover:underline">{officeEmail}</a></dd>
      </div>
      <div className="flex items-start gap-2.5">
        <dt>
          <Clock className="mt-0.5 size-4 text-[#164E9B]" aria-hidden="true" />
          <span className="sr-only">Giờ làm việc</span>
        </dt>
        <dd>
          Thứ Hai đến Thứ Sáu
          <br />
          Sáng 07:30 – 11:30 · Chiều 13:30 – 17:00
        </dd>
      </div>
    </dl>
  );
}
