import React from 'react';
import Svg, { Circle, Rect, Path, Polygon, G, Line, Text as SvgText } from 'react-native-svg';

const RED = '#D32F2F';
const BLUE = '#1F5FBF';
const INK = '#151515';

// Glyphs are designed inside a 100x100 box, content roughly 20..80.
function Glyph({ name, color, sign }) {
  const st = { stroke: color, strokeWidth: 9, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'arrowUp':
      return <Path d="M50 18 L72 42 H58 V82 H42 V42 H28 Z" fill={color} />;
    case 'keepRight':
      return (
        <G rotation={135} origin="50,50">
          <Path d="M50 18 L72 42 H58 V82 H42 V42 H28 Z" fill={color} />
        </G>
      );
    case 'turnLeft':
      return (
        <G>
          <Path d="M62 82 V52 Q62 40 50 40 H38" {...st} strokeWidth={11} strokeLinecap="butt" />
          <Polygon points="22,40 40,24 40,56" fill={color} />
        </G>
      );
    case 'turnRight':
      return (
        <G>
          <Path d="M38 82 V52 Q38 40 50 40 H62" {...st} strokeWidth={11} strokeLinecap="butt" />
          <Polygon points="78,40 60,24 60,56" fill={color} />
        </G>
      );
    case 'uturn':
      return (
        <G>
          <Path d="M36 82 V46 A14 14 0 0 1 64 46 V58" {...st} strokeWidth={10} strokeLinecap="butt" />
          <Polygon points="64,76 50,56 78,56" fill={color} />
        </G>
      );
    case 'curveRight':
      return (
        <G>
          <Path d="M42 84 V62 Q42 48 54 40 L58 37" {...st} strokeWidth={10} strokeLinecap="butt" />
          <Polygon points="70,26 48,30 62,48" fill={color} />
        </G>
      );
    case 'curveLeft':
      return (
        <G>
          <Path d="M58 84 V62 Q58 48 46 40 L42 37" {...st} strokeWidth={10} strokeLinecap="butt" />
          <Polygon points="30,26 52,30 38,48" fill={color} />
        </G>
      );
    case 'roundabout':
      return (
        <G>
          <Circle cx={50} cy={50} r={20} {...st} strokeWidth={8} />
          {[0, 120, 240].map((a) => (
            <G key={a} rotation={a} origin="50,50">
              <Polygon points="50,19 62,30 50,38" fill={color} />
            </G>
          ))}
        </G>
      );
    case 'pedestrian':
      return (
        <G>
          <Circle cx={52} cy={24} r={8} fill={color} />
          <Path d="M50 36 L46 58 L34 80 M46 58 L60 80 M48 42 L34 54 M50 42 L64 52" {...st} strokeWidth={8} />
        </G>
      );
    case 'children':
      return (
        <G>
          <Circle cx={38} cy={30} r={7} fill={color} />
          <Path d="M37 40 L34 60 L26 80 M34 60 L42 80 M36 46 L26 56 M37 46 L48 52" {...st} strokeWidth={7} />
          <Circle cx={64} cy={38} r={6} fill={color} />
          <Path d="M63 47 L61 64 L55 80 M61 64 L68 80 M62 52 L52 56 M63 52 L72 60" {...st} strokeWidth={6} />
        </G>
      );
    case 'slippery':
      return (
        <G>
          <Rect x={32} y={24} width={36} height={22} rx={6} fill={color} />
          <Rect x={38} y={16} width={24} height={12} rx={4} fill={color} />
          <Path d="M36 56 Q28 64 36 72 Q44 80 36 86" {...st} strokeWidth={6} />
          <Path d="M64 56 Q56 64 64 72 Q72 80 64 86" {...st} strokeWidth={6} />
        </G>
      );
    case 'signals':
      return (
        <G>
          <Rect x={36} y={16} width={28} height={68} rx={8} fill={INK} />
          <Circle cx={50} cy={30} r={8} fill="#E53935" />
          <Circle cx={50} cy={50} r={8} fill="#F9A825" />
          <Circle cx={50} cy={70} r={8} fill="#2E7D32" />
        </G>
      );
    case 'bump':
      return <Path d="M16 74 Q50 22 84 74 Z" fill={color} />;
    case 'twoWay':
      return (
        <G>
          <Path d="M36 18 L52 38 H42 V82 H30 V38 H20 Z" fill={color} />
          <Path d="M64 82 L48 62 H58 V18 H70 V62 H80 Z" fill={color} />
        </G>
      );
    case 'camel':
      return (
        <Path
          d="M20 54 Q26 34 40 44 Q48 28 60 46 Q66 48 68 40 L72 28 Q77 22 83 28 L82 35 L76 37 L74 54 Q72 60 66 60 L66 80 L60 80 L60 62 L36 62 L36 80 L30 80 L30 60 Q20 60 20 54 Z"
          fill={color}
        />
      );
    case 'narrow':
      return (
        <G>
          <Path d="M30 84 V60 L42 42 V16" {...st} strokeWidth={8} />
          <Path d="M70 84 V60 L58 42 V16" {...st} strokeWidth={8} />
        </G>
      );
    case 'cross':
      return (
        <G>
          <Rect x={43} y={14} width={14} height={72} fill={color} />
          <Rect x={18} y={43} width={64} height={14} fill={color} />
        </G>
      );
    case 'works':
      return (
        <G>
          <Circle cx={40} cy={24} r={7} fill={color} />
          <Path d="M40 34 L46 56 L38 80 M46 56 L58 78 M42 40 L60 50 L70 64" {...st} strokeWidth={7} />
          <Polygon points="58,84 82,84 70,66" fill={color} />
        </G>
      );
    case 'twoCars': {
      const car = (x, c) => (
        <G key={x}>
          <Rect x={x} y={40} width={22} height={28} rx={5} fill={c} />
          <Rect x={x + 4} y={32} width={14} height={14} rx={4} fill={c} />
          <Rect x={x - 2} y={66} width={7} height={8} rx={2} fill={c} />
          <Rect x={x + 17} y={66} width={7} height={8} rx={2} fill={c} />
        </G>
      );
      return <G>{car(24, RED)}{car(54, INK)}</G>;
    }
    case 'horn':
      return <Path d="M22 40 H38 L68 22 V78 L38 60 H22 Z" fill={color} />;
    case 'speed':
      return (
        <G>
          <SvgText x={50} y={54} fontSize={34} fontWeight="bold" fill={INK} textAnchor="middle">{sign.text}</SvgText>
          <SvgText x={50} y={80} fontSize={18} fontWeight="bold" fill={INK} textAnchor="middle">{sign.textAr}</SvgText>
        </G>
      );
    case 'letter':
      return <SvgText x={50} y={70} fontSize={56} fontWeight="bold" fill="#fff" textAnchor="middle">{sign.text}</SvgText>;
    case 'stopText':
      return (
        <G>
          <SvgText x={50} y={50} fontSize={26} fontWeight="bold" fill="#fff" textAnchor="middle">قف</SvgText>
          <SvgText x={50} y={74} fontSize={19} fontWeight="bold" fill="#fff" textAnchor="middle">STOP</SvgText>
        </G>
      );
    default:
      return null;
  }
}

export default function SignGraphic({ sign, size = 120 }) {
  const { shape, glyph } = sign;
  let base = null;
  let glyphColor = INK;
  let inner = 'full'; // where to place glyph
  switch (shape) {
    case 'octagon':
      base = <Polygon points="31,4 69,4 96,31 96,69 69,96 31,96 4,69 4,31" fill={RED} stroke="#fff" strokeWidth={3} />;
      break;
    case 'triangle':
      base = <Polygon points="50,7 95,88 5,88" fill="#fff" stroke={RED} strokeWidth={8} strokeLinejoin="round" />;
      inner = 'tri';
      break;
    case 'invTriangle':
      base = (
        <G>
          <Polygon points="5,12 95,12 50,93" fill="#fff" stroke={RED} strokeWidth={9} strokeLinejoin="round" />
          <SvgText x={50} y={40} fontSize={11} fontWeight="bold" fill={INK} textAnchor="middle">أفسح الطريق</SvgText>
        </G>
      );
      break;
    case 'circleRed':
      base = <Circle cx={50} cy={50} r={44} fill="#fff" stroke={RED} strokeWidth={9} />;
      inner = 'circle';
      break;
    case 'circleBlue':
      base = <Circle cx={50} cy={50} r={46} fill={BLUE} stroke="#fff" strokeWidth={2} />;
      glyphColor = '#fff';
      inner = 'circle';
      break;
    case 'noEntry':
      base = (
        <G>
          <Circle cx={50} cy={50} r={46} fill={RED} />
          <Rect x={18} y={41} width={64} height={18} rx={2} fill="#fff" />
        </G>
      );
      break;
    case 'noParking':
      base = (
        <G>
          <Circle cx={50} cy={50} r={44} fill={BLUE} stroke={RED} strokeWidth={9} />
          <Line x1={22} y1={22} x2={78} y2={78} stroke={RED} strokeWidth={9} />
        </G>
      );
      break;
    case 'squareBlue':
      base = <Rect x={6} y={6} width={88} height={88} rx={12} fill={BLUE} stroke="#fff" strokeWidth={3} />;
      glyphColor = '#fff';
      break;
    default:
      break;
  }

  const g = <Glyph name={glyph} color={glyphColor} sign={sign} />;
  let placed = g;
  if (inner === 'tri') placed = <G transform="translate(50,62) scale(0.5) translate(-50,-50)">{g}</G>;
  else if (inner === 'circle' && glyph !== 'speed') placed = <G transform="translate(50,50) scale(0.72) translate(-50,-50)">{g}</G>;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {base}
      {placed}
      {sign.slash && <Line x1={20} y1={20} x2={80} y2={80} stroke={RED} strokeWidth={8} />}
    </Svg>
  );
}
