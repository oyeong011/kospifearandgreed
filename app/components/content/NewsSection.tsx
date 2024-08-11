"use client";

import React from "react";

const NewsSection = () => {
  const newsData = [
    {
      title: "코스피, 3개월 만에 최고치 기록",
      link: "https://example.com/news1",
      description:
        "코스피 지수가 3개월 만에 최고치를 기록하며 투자자들의 관심을 끌고 있습니다.",
    },
    {
      title: "무역 실적 호조, 수출 증가로 경제 회복 기대",
      link: "https://example.com/news1",
      description:
        "최근 무역 실적이 호조를 보이며 수출 증가로 인한 경제 회복이 기대되고 있습니다.",
    },
    {
      title: "코스피, 글로벌 경제 불확실성에도 안정세 유지",
      link: "https://example.com/news1",
      description:
        "코스피 지수가 글로벌 경제의 불확실성에도 불구하고 안정세를 유지하고 있는 모습입니다.",
    },
    {
      title: "무역 적자 감소, 경제 성장률 2%대 회복 전망",
      link: "https://example.com/news1",
      description:
        "무역 적자가 감소하며 경제 성장률이 2%대로 회복될 전망입니다.",
    },
    {
      title: "코스피, 외국인 매수세에 힘입어 상승 마감",
      link: "https://example.com/news1",
      description:
        "코스피 지수가 외국인 투자자들의 매수세에 힘입어 상승 마감했습니다.",
    },
    {
      title: "수출 호조, 원화 강세에도 무역 흑자 기록",
      link: "https://example.com/news1",
      description:
        "수출이 호조를 보이며 원화 강세에도 불구하고 무역 흑자를 기록했습니다.",
    },
    {
      title: "코스피, IT 및 반도체 업종 강세에 힘입어 상승",
      link: "https://example.com/news1",
      description:
        "코스피 지수가 IT 및 반도체 업종의 강세에 힘입어 상승했습니다.",
    },
    {
      title: "무역 실적 개선, 경제 회복에 청신호",
      link: "https://example.com/news1",
      description: "무역 실적 개선이 지속되며 경제 회복에 청신호가 켜졌습니다.",
    },
    {
      title: "코스피, 미국 증시 상승 영향 받아 강세",
      link: "https://example.com/news1",
      description:
        "코스피 지수가 미국 증시 상승의 긍정적 영향을 받아 강세를 보였습니다.",
    },
    {
      title: "수출 증가세 지속, 국내 경제 활력 회복",
      link: "https://example.com/news1",
      description:
        "수출 증가세가 지속되며 국내 경제에 활력이 돌아오고 있습니다.",
    },
  ];
  return (
    <div className="p-5">
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
