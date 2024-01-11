import { DashboardRpmEnum } from '@/enums/dashboardEnum';
import './index.scss';

// 数字刻度值列表长度
const digitalScaleListLen = DashboardRpmEnum.maxRpm / 1 + 1;

// 数字刻度值列表
const digitalScaleList = Array.from({ length: digitalScaleListLen }, (_, i) => i);
// 条形刻度列表
const scaleList = Array.from({ length: (digitalScaleListLen - 1) * 5 + 1 }, (_, i) => +(i * 0.2).toFixed(2));

const RpmGauge = (props: RpmGaugeProps) => {
	// 数字刻度值元素列表
	const digitalScaleElements = digitalScaleList.map(ds => (
		<li key={ds} className='digital-scale-item'>
			{ds === 0 ? '' : ds}
		</li>
	));

	// 条形刻度元素列表
	const scaleElements = scaleList.map(scale => {
		const className = scale % 1 === 0 ? 'scale-item bold' : 'scale-item';
		return <li key={scale} className={className}></li>;
	});

	const rpmGaugeEleStyle = {
		'--pointer-initial-angle': `${(props.rpm / 1) * 30}deg`
	} as React.CSSProperties;
	return (
		<section className='rpm-gauge' style={rpmGaugeEleStyle}>
			<ul className='digital-scale'>{digitalScaleElements}</ul>
			<ul className='scale'>{scaleElements}</ul>

			<div className='pointer-box'>
				<div className='pointer'></div>
			</div>

			<div className='gears'>{props.gear}</div>
		</section>
	);
};

export default RpmGauge;

type RpmGaugeProps = {
	rpm: number;
	gear: string;
};
