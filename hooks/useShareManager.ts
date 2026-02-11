import { useCallback, useState } from 'react';
import { SelectedCard, TarotSpread } from '../types';

export const useShareManager = (
  readingResult: string,
  question: string,
  selectedSpread: TarotSpread,
  selectedMbti: string,
  selectedCards: SelectedCard[]
) => {
  const [isCopied, setIsCopied] = useState(false);

  const generateShareImage = useCallback(async (): Promise<File | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = 1080;
    canvas.height = 1920;
    const isFiveCards = selectedCards.length === 5;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const bgImg = await loadImage('/background.jpg');
      const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
      const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
      const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } catch (e) {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText(selectedSpread.name, canvas.width / 2, 610);

    const cardWidth = 280;
    const cardHeight = 500;
    const cardStartY = isFiveCards ? 680 : 720;
    let maxContentY = 0;

    for (let i = 0; i < selectedCards.length; i++) {
      const card = selectedCards[i];
      let x, y;
      if (isFiveCards) {
        const row = i < 3 ? 0 : 1;
        const col = i < 3 ? i : i - 3;
        const numInRow = row === 0 ? 3 : 2;
        const horizontalGap = 40;
        const rowWidth = numInRow * cardWidth + (numInRow - 1) * horizontalGap;
        x = (canvas.width - rowWidth) / 2 + col * (cardWidth + horizontalGap);
        y = cardStartY + row * 630;
      } else {
        const horizontalGap = 40;
        const totalGap = (selectedCards.length - 1) * horizontalGap;
        const startX = (canvas.width - (selectedCards.length * cardWidth + totalGap)) / 2;
        x = startX + i * (cardWidth + horizontalGap);
        y = cardStartY;
      }

      const img = await loadImage(`/image/${String(card.id).padStart(2, '0')}.jpg`);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, cardWidth, cardHeight, 15);
      ctx.clip();
      if (card.isReversed) {
        ctx.translate(x + cardWidth / 2, y + cardHeight / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
        ctx.restore();
      } else {
        ctx.drawImage(img, x, y, cardWidth, cardHeight);
        ctx.restore();
      }

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 35px sans-serif';
      ctx.fillText(card.nameKo.split('(')[0].trim(), x + cardWidth / 2, y + cardHeight + 60);

      // 뽑은 방향 (Direction)
      ctx.fillStyle = card.isReversed ? '#fca5a5' : '#6ee7b7';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(card.isReversed ? '역방향' : '정방향', x + cardWidth / 2, y + cardHeight + 110);

      // 카드 의미 (Meaning) - 한 줄 요약
      ctx.fillStyle = '#94a3b8';
      ctx.font = '26px sans-serif';
      const meaning = card.isReversed ? card.meaningRev : card.meaningUp;
      const shortMeaning = meaning.length > 20 ? meaning.substring(0, 18) + '...' : meaning;
      ctx.fillText(shortMeaning, x + cardWidth / 2, y + cardHeight + 160);

      maxContentY = Math.max(maxContentY, y + cardHeight + 220);
    }

    // 유명인 명언 추출 및 그리기
    const quoteMatch = readingResult.match(/>\s*"(.*?)"\s*-\s*(.*)/);
    if (quoteMatch) {
      const quoteText = quoteMatch[1].trim();
      const authorText = quoteMatch[2].trim();

      ctx.save();
      ctx.textAlign = 'center';

      // 명언 본문 (줄바꿈 처리)
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'italic 36px serif';

      const maxWidth = 800;
      const lineHeight = 50;
      const words = quoteText.split(' ');
      let line = '';
      let lines = [];

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let quoteY = maxContentY + 60;
      lines.forEach((l, i) => {
        ctx.fillText(`"${l.trim()}"`, canvas.width / 2, quoteY + (i * lineHeight));
      });

      // 명언을 한 인물
      ctx.fillStyle = '#94a3b8';
      ctx.font = '28px sans-serif';
      ctx.fillText(`- ${authorText}`, canvas.width / 2, quoteY + (lines.length * lineHeight) + 20);
      ctx.restore();
    }

    ctx.fillStyle = '#ffdd00ff';
    ctx.font = '40px sans-serif';
    ctx.fillText('MBTI 타로운세가 당신의 오늘을 응원합니다.', canvas.width / 2, 1800);
    ctx.fillStyle = '#64748b';
    ctx.font = '35px sans-serif';
    ctx.fillText('나의 운명 확인하기 : mbtitarot.co.kr', canvas.width / 2, 1860);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        resolve(new File([blob], `mbti-tarot-${Date.now()}.png`, { type: 'image/png' }));
      }, 'image/png');
    });
  }, [selectedCards, selectedSpread, readingResult]);

  const shareToKakao = useCallback(async () => {
    if (!window.Kakao) {
      console.error("Kakao SDK not loaded");
      alert("카카오톡 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      const KAKAO_KEY = '0398256e094e7a60932217b241aafdd6';
      try {
        window.Kakao.init(KAKAO_KEY);
        console.log("Kakao SDK initialized on demand");
      } catch (e) {
        console.error("Kakao Init Failed", e);
        return;
      }
    }

    const imageUrl = selectedCards.length > 0
      ? `https://mbtitarot.co.kr/image/${String(selectedCards[0].id).padStart(2, '0')}.jpg`
      : 'https://mbtitarot.co.kr/intro-landing.jpg';

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `🔑 ${selectedCards[0]?.nameKo.split('(')[0].trim() || "운명의 카드"}`,
          description: "타로 카드가 전하는 심층적인 메시지를 확인해보세요.",
          imageUrl: imageUrl,
          link: { mobileWebUrl: 'https://mbtitarot.co.kr/', webUrl: 'https://mbtitarot.co.kr/' },
        },
        buttons: [{ title: '결과 보기', link: { mobileWebUrl: 'https://mbtitarot.co.kr/', webUrl: 'https://mbtitarot.co.kr/' } }],
      });
      console.log("Kakao share command sent");
    } catch (error) {
      console.error("Kakao Share Error:", error);
      alert("카카오톡 공유 중 오류가 발생했습니다.");
    }
  }, [selectedCards]);

  const performShare = useCallback(async (type: 'text' | 'image' | 'both') => {
    const textToShare = `🔮 MBTI 타로운세 결과\nhttps://mbtitarot.co.kr/`;
    if (type === 'text') {
      if (navigator.share) await navigator.share({ text: textToShare });
      else {
        await navigator.clipboard.writeText(textToShare);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } else {
      const file = await generateShareImage();
      if (file && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: textToShare });
      }
    }
  }, [generateShareImage]);

  return { isCopied, shareToKakao, performShare };
};
