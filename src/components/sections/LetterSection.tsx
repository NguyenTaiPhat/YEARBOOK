"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { PenLine } from "@/components/ui/Icons";

const LETTER_PARAGRAPHS = [
  {
    text: "Gửi người bạn A19,",
    isGreeting: true,
  },
  {
    text: "Thật ra là đầu năm đến giờ tao cũng đã suy nghĩ rất nhiều về việc sẽ viết những gì cho lá thư này. Làm sao để có thể viết ra những cái cảm xúc trong lòng của tao để gửi đến cho tụi bây...",
  },
  {
    text: "Ba năm — tưởng chừng rất dài, nhưng khi mà tao nhìn lại ở phương diện là lớp 12 thì lại thấy quảng thời gian 3 năm thật sự rất ít đối với tao. Có những khoảng thời gian mà tao cảm thấy như vừa mới hôm qua thôi mà tụi mình đã cùng nhau trải qua biết bao nhiêu chuyện rồi.",
  },
  {
    text: "Có những lúc cãi nhau (có thể là siêu căng luônnn), nhưng lớp chúng ta vẫn luôn là một tập thể phải nói là toẹt vời vãi lol. Nào là cùng tích cực tham gia tất cả hoạt động mà nhà trường phát động, cùng nhau trải qua những khó khăn, sau đó lại nhận được cả đống giấy khen với tất cả thành tích (nói chung là phong trào nào tham gia thì lớp luôn có thành tích mặc dù không cao :D). Tuy mệt nhưng nó lại là thứ hàn gắn chúng ta và tạo nên những kỷ niệm thật đẹp với nhau. <3",
  },
  {
    text: "Tao biết ơn từng đứa trong lớp. Mỗi đứa, theo cách riêng của mình đã góp phần làm cho những năm tháng cấp ba của tao trở nên vui hơn :D, ý nghĩa hơn và đáng nhớ hơn rất nhìuuu. Dù sau này tụi mình có còn gặp nhau thường xuyên hay khum, dù mỗi đứa sẽ bước đi trên một con đường riêng thì những kỷ niệm mà tụi mình đã cùng nhau tạo nên sẽ luôn là một phần thanh xuân mà tao luôn nhớ mãiii.",
  },
  {
    text: "Chỉ còn một chặng đường ngắn nữa thôi là tụi mình sẽ bước vào kỳ thi quan trọng nhất của những năm tháng học sinh. Tao mong rằng tất cả những nỗ lực, những đêm thức khuya học bài, những lần áp lực đến bật khóc của tụi mình đều sẽ được đền đáp xứng đáng.",
  },
  {
    text: "Chúc cho mỗi người trong lớp đều sẽ nhận được tin vui vào ngày công bố kết quả. Chúc tụi bây đỗ vào ngôi trường mình hằng mong ước, học đúng ngành mình yêu thích và bắt đầu một hành trình mới thật rực rỡ nhaaaaaaaaaaa.",
  },
  {
    text: "Nhớ nha! Phải thật sự rực rỡ đó. Vì chỉ có chính mày mới có thể tạo nên cuộc đời mà mày hằng mong ước.",
    isSignoff: true,
  },
];

function LetterParagraph({ para, index }: { para: typeof LETTER_PARAGRAPHS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.p
      ref={ref}
      className={`leading-relaxed mb-5 ${para.isGreeting
        ? "text-[var(--soft-gold)] font-semibold text-xl"
        : para.isSignoff
          ? "text-[var(--text-primary)] font-medium"
          : "text-[var(--text-primary)]"
        }`}
      style={{
        fontFamily: "var(--font-handwriting), cursive",
        fontSize: para.isGreeting ? "clamp(20px, 2.8vw, 24px)" : "clamp(17px, 2.4vw, 20px)",
        lineHeight: 1.8,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.05 }}
    >
      {para.text}
    </motion.p>
  );
}

export function LetterSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      id="letter-section"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Background parallax decoration */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--soft-gold)] to-transparent opacity-20" />
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--soft-gold)] to-transparent opacity-20" />
        {/* Decorative corner flourishes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-[var(--soft-gold)] opacity-20 rounded-tl-lg" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-[var(--soft-gold)] opacity-20 rounded-br-lg" />
      </motion.div>

      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Read My Letter
          </h2>
          <div className="section-divider mb-6" />
        </motion.div>

        {/* Letter card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Paper card */}
          <div
            className="letter-paper paper-texture rounded-2xl shadow-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 20px 60px rgba(59,48,40,0.12), 0 4px 20px rgba(59,48,40,0.08), inset 0 0 0 1px rgba(184,147,103,0.2)",
            }}
          >
            {/* Top strip */}
            <div
              className="h-3 w-full"
              style={{
                background: "linear-gradient(90deg, var(--soft-gold) 0%, #D4A96A 50%, var(--soft-gold) 100%)",
              }}
            />

            <div className="px-5 md:px-12 py-8 md:py-10">
              {/* Avatar circle */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-[var(--border-warm)]">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--soft-gold)] border-opacity-40 shadow-sm bg-[var(--soft-gold)] bg-opacity-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avt.png"
                  alt="Nguyễn Tài Phát"
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className="text-[var(--text-secondary)] text-sm max-w-xl text-justify"
                style={{
                  lineHeight: 1.8,
                  fontFamily: "var(--font-handwriting), cursive", fontSize: "20px",
                }}
              >
                Đây là những dòng nhắn nhủ của tao từ tận đáy lòng...<br />
                Nhớ đọc hết nhe.
              </p>
            </div>

              {/* Letter content */}
              <div>
                {LETTER_PARAGRAPHS.map((para, i) => (
                  <LetterParagraph key={i} para={para} index={i} />
                ))}
              </div>

              {/* Signature block */}
              <div className="mt-10 pt-8 border-t border-[var(--border-warm)]">
                <p
                  className="text-[var(--text-secondary)] mb-3"
                  style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "17px" }}
                >
                  Nhớ toả sáng đó nha!...
                </p>
                <p
                  className="text-[var(--soft-gold)] font-bold text-3xl md:text-4xl"
                  style={{ fontFamily: "var(--font-handwriting), cursive" }}
                >
                  Nguyễn Tài Phát
                </p>
                <p className="text-[var(--text-secondary)] text-xs mt-1 tracking-widest uppercase">
                  06-06-2026 | 2023–2026
                </p>

                {/* Decorative seal */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--border-warm)]" />
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--soft-gold)] border-opacity-40 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 10.5L3 14L4.5 8.5L0 5.5H5.5L7 0Z"
                        fill="currentColor" className="text-[var(--soft-gold)]" opacity="0.7" />
                    </svg>
                  </div>
                  <div className="flex-1 h-px bg-[var(--border-warm)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Paper shadow layers */}
          <div
            className="absolute -bottom-2 left-2 right-2 h-full rounded-2xl -z-10 opacity-30"
            style={{ background: "var(--accent-beige)" }}
          />
          <div
            className="absolute -bottom-4 left-4 right-4 h-full rounded-2xl -z-20 opacity-15"
            style={{ background: "var(--warm-sand)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
