import { DashboardSpeedEnum } from '@/enums/dashboardEnum';
import './index.scss';

// 数字刻度值列表长度
const digitalScaleListLen = DashboardSpeedEnum.maxSpeed / 20 + 1;

// 数字刻度值列表
const digitalScaleList = Array.from({ length: digitalScaleListLen }, (_, i) => i * 20);
// 条形刻度列表
const scaleList = Array.from({ length: (digitalScaleListLen - 1) * 5 + 1 }, (_, i) => +(i * 0.4).toFixed(2));

const SpeedGauge = (props: SpeedGaugeProps) => {
	// 数字刻度值元素列表
	const digitalScaleElements = digitalScaleList.map(ds => (
		<li key={ds} className='digital-scale-item'>
			{ds === 0 ? '' : ds}
		</li>
	));

	// 条形刻度元素列表
	const scaleElements = scaleList.map(scale => {
		const className = scale % 2 === 0 ? 'scale-item bold' : 'scale-item';
		return <li key={scale} className={className}></li>;
	});

	const speedGaugeEleStyle = {
		'--pointer-initial-angle': `${(props.speed / 20) * 20}deg`
	} as React.CSSProperties;
	return (
		<section className='speed-gauge' style={speedGaugeEleStyle}>
			<ul className='digital-scale'>{digitalScaleElements}</ul>
			<ul className='scale'>{scaleElements}</ul>

			<div className='pointer-box'>
				<div className='pointer'></div>
			</div>

			<div className='gears'>{props.speed.toFixed(0)}</div>
		</section>
	);
};

export default SpeedGauge;

type SpeedGaugeProps = {
	speed: number;
};
