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
      maxContentY = y + cardHeight + 155;
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
    if (!window.Kakao) return;
    const imageUrl = selectedCards.length > 0
      ? `https://mbtitarot.co.kr/image/${String(selectedCards[0].id).padStart(2, '0')}.jpg`
      : 'https://mbtitarot.co.kr/intro-landing.jpg';

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `🔑 ${selectedCards[0]?.nameKo.split('(')[0].trim() || "운명의 카드"}`,
        description: "타로 카드가 전하는 심층적인 메시지를 확인해보세요.",
        imageUrl: imageUrl,
        link: { mobileWebUrl: 'https://www.mbtitarot.co.kr/', webUrl: 'https://www.mbtitarot.co.kr/' },
      },
      buttons: [{ title: '결과 보기', link: { mobileWebUrl: 'https://www.mbtitarot.co.kr/', webUrl: 'https://www.mbtitarot.co.kr/' } }],
    });
  }, [selectedCards]);

  const performShare = useCallback(async (type: 'text' | 'image' | 'both') => {
    const textToShare = `🔮 MBTI 타로운세 결과\nhttps://www.mbtitarot.co.kr/`;
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
