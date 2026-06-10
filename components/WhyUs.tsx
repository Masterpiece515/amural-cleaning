const stats = [
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    value: "500 +",
    label: "уборок выполнено",
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    value: "24/7",
    label: "поддержка клиентов",
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: "Опыт",
    label: "Более 10 лет работы и 300 положительных отзывов",
  },
];

const advantages = [
  { text: "Профессиональный персонал" },
  { text: "Современные средства и оборудование" },
  { text: "Индивидуальный подход к каждому клиенту" },
  { text: "Гарантия качества на все работы" },
  { text: "Удобное время и гибкий график" },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-[#1a1a19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Почему нам <span className="text-[#22720C]">доверяют</span>
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-[#313130] rounded-2xl p-8 flex flex-col items-center text-center gap-3">
              {stat.icon}
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Advantages */}
        <div className="bg-[#313130] rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-[#22720C] mb-6 text-center">Почему выбирают нас</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advantages.map((adv) => (
              <div key={adv.text} className="flex items-center gap-3 bg-[#3d3d3c] rounded-xl px-5 py-4">
                <span className="text-[#22720C] flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-200 text-sm">{adv.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
