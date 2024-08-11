"use client";

import React from "react";

const NewsSection = () => {
  const newsData = [
    {
      title: "금융 시장 동향",
      link: "https://example.com/news1",
      description: "오늘의 금융 시장 동향을 분석한 기사입니다.",
    },
    {
      title: "채권 시장의 변화",
      link: "https://example.com/news2",
      description: "채권 시장의 최근 변동 사항을 다룹니다.",
    },
    {
      title: "주식 시장의 투자 전략",
      link: "https://example.com/news3",
      description: "주식 시장에서 효과적인 투자 전략을 소개합니다.",
    },
    {
      title: "암호화폐 시장 동향",
      link: "https://example.com/news4",
      description: "오늘의 암호화폐 시장 동향을 정리합니다.",
    },
  ];

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">오늘의 주요 뉴스</h2>
      <ul className="space-y-4">
        {newsData.map((news, index) => (
          <li key={index} className="p-3 border border-gray-300 rounded-md">
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              <h3 className="text-lg font-bold">{news.title}</h3>
            </a>
            <p className="text-gray-700">{news.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;
