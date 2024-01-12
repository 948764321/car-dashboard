import { GearSpeedConfig } from '@/config';
import { DashboardGearEnum } from '@/enums/dashboardEnum';
import useSounds from '@/hooks/useSounds';
import { useEffect, useReducer, useRef } from 'react';
import BreatheTitle from './components/breathe-title';
import RpmGauge from './components/rpm-gauge';
import SpeedGauge from './components/speed-gauge';
import './index.scss';
import { ActionType, GearSpeedState, gearSpeedReducer, gearSpeedState } from './reducers/gearSpeed';

// 档位顺序列表
const gearOrderList = [
	DashboardGearEnum.gearOne,
	DashboardGearEnum.gearTwo,
	DashboardGearEnum.gearThree,
	DashboardGearEnum.gearFour,
	DashboardGearEnum.gearFive,
	DashboardGearEnum.gearSix,
	DashboardGearEnum.gearSeven,
	DashboardGearEnum.gearEight
];

const Dashboard = () => {
	// 是否给油
	const accRef = useRef(false);
	const [gearSpeedStatus, dph] = useReducer(gearSpeedReducer, gearSpeedState);
	const { playSound, stopSound } = useSounds();

	/** 封装 dispatch，用来获取最新 state */
	const dispatch = (state: GearSpeedState, action: ActionType) => {
		dph(action);
		return gearSpeedReducer(state, action);
	};

	// 监听外部事件
	useEffect(() => {
		const accListener = (e: KeyboardEvent | TouchEvent) => {
			if (e instanceof KeyboardEvent && e.key !== 'ArrowUp') return;
			accRef.current = true;
			playSound('drive');
			playSound('catapult');
		};
		const downListener = (e: KeyboardEvent | TouchEvent) => {
			if (e instanceof KeyboardEvent && e.key !== 'ArrowUp') return;
			accRef.current = false;
			stopSound('catapult');
		};

		document.addEventListener('keyup', downListener);
		document.addEventListener('keydown', accListener);
		document.addEventListener('touchstart', accListener);
		document.addEventListener('touchend', downListener);

		return () => {
			document.removeEventListener('keyup', downListener);
			document.removeEventListener('keydown', accListener);
			document.removeEventListener('touchstart', accListener);
			document.removeEventListener('touchend', downListener);
		};
	}, []);

	useEffect(() => {
		let requestId: number | null = null;

		const _handleAcc = (state: GearSpeedState) => {
			let newState: GearSpeedState = state;
			const currentRange = GearSpeedConfig.find(item => newState.gear === item.gear);

			if (!currentRange) throw Error('空挡，档位设计不合理');

			const acc = accRef.current;
			const { maxRpm, minRpm, maxSpeed, minSpeed, gear } = currentRange;
			const gearIndex = gearOrderList.findIndex(item => item === gear);

			const nextRpm = acc ? Math.min(newState.rpm + 0.15, maxRpm) : Math.max(newState.rpm - 0.1, minRpm);
			const nextSpeed = acc ? Math.min(newState.speed + 0.5, maxSpeed) : Math.max(newState.speed - 1.5, minSpeed);

			let nextGear: DashboardGearEnum = newState.gear;
			if (acc && nextSpeed >= maxSpeed) {
				nextGear = gearOrderList[Math.min(gearIndex + 1, gearOrderList.length - 1)];
			} else if (!acc && nextSpeed <= maxSpeed) {
				nextGear = gearOrderList[Math.max(gearIndex - 1, 0)];
			}

			const action = { type: 'SET_ALL', rpm: nextRpm, speed: nextSpeed, gear: nextGear } as const;
			newState = dispatch(newState, action);

			requestId = requestAnimationFrame(() => _handleAcc(newState));
		};

		_handleAcc(gearSpeedState);

		return () => {
			requestId && cancelAnimationFrame(requestId);
		};
	}, []);

	return (
		<div className='dashboard'>
			<RpmGauge rpm={gearSpeedStatus.rpm} gear={gearSpeedStatus.gear} />
			<SpeedGauge speed={gearSpeedStatus.speed} />
			<BreatheTitle />
		</div>
	);
};

export default Dashboard;
