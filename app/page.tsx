"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import Footer from "@/components/Footer";
import RoleCards from "@/components/RoleCards";
import Image from "next/image";
import StatsSection from "@/components/StatsSection";
import AppFeedDemo from "@/components/AppFeedDemo";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	return (
		<>
			<style>{`
				@keyframes radarSpin {
					from { transform: rotate(0deg); }
					to   { transform: rotate(360deg); }
				}
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-12px); }
				}
			`}</style>

			<Navbar />
			<div className="bg-gradient-to-br from-[#090909] via-[#1a1a1a] to-[#090909] text-white overflow-x-hidden">
				{/* HOME */}
				<section
					id="home"
					className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
				>
					{/* Grid Pattern Background */}
					<div
						className="absolute pointer-events-none"
						style={{
							zIndex: 0,
							backgroundImage: `
								linear-gradient(rgba(253, 77, 77, 0.05) 2px, transparent 2px),
								linear-gradient(90deg, rgba(253, 77, 77, 0.05) 2px, transparent 2px)
							`,
							backgroundSize: "210px 200px",
							backgroundPosition: "1000 1000",
							transform:
								"perspective(1200px) rotateX(-35deg) rotateZ(0deg)",
							transformOrigin: "center center",
							top: "-50%",
							left: "-10%",
							right: "-50%",
							bottom: "-10%",
							width: "120%",
							height: "200%",
						}}
					/>

					{/* Red Radial Glow */}
					<div
						className="absolute pointer-events-none w-full h-full top-0 left-0"
						style={{
							zIndex: 1,
							background:
								"radial-gradient(circle at center, rgba(253, 77, 77, 0.18), transparent 60%)",
							mixBlendMode: "soft-light",
						}}
					/>

					{/* Hero Content */}
					<div
						className="relative w-full max-w-[72vw] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12"
						style={{ zIndex: 10 }}
					>
						{/* Left: Text */}
						<div className="flex flex-col items-start space-y-8 lg:max-w-[55%]">
							<div>
								<div className="bg-[#fd4d4d]/10 px-4 py-2 rounded-full border border-[#fd4d4d]/10 inline-block">
									<p className="text-[#fd4d4d] text-xs font-semibold uppercase tracking-widest">
										DispatchNow · BETA
									</p>
								</div>
							</div>

							<h1 className="text-5xl xl:text-7xl text-left font-extrabold leading-tight font-sans">
								A{" "}
								<span
									className="text-[#fd4d4d]"
									style={{
										textShadow:
											"0 0 40px rgba(253, 77, 77, 0.6), 0 0 80px rgba(253, 77, 77, 0.2)",
									}}
								>
									Smarter
								</span>{" "}
								Way to Report and Respond to Disasters
							</h1>

							<h3 className="text-neutral-500 text-xl font-bold text-left font-sans">
								Coordinate resources in real time, collaborate
								seamlessly with your team, and allocate
								intelligently, all in one platform your disaster
								response team can rely on.
							</h3>

							<div className="flex flex-col sm:flex-row gap-4">
								<button
									onClick={() => router.push("/login")}
									className="cursor-pointer flex items-center justify-center gap-3 px-8 py-3 border border-neutral-700 bg-neutral-900 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-neutral-800"
								>
									Get Started
									<FaArrowRight />
								</button>
							</div>
						</div>

						{/* Right: Laptop SVG */}
						<div className="flex-shrink-0 lg:max-w-[42%] w-full flex items-center justify-center">
							<Image
								src="/laptop.svg"
								alt="DispatchNow platform preview"
								width={780}
								height={560}
								className="w-full h-auto drop-shadow-[0_0_60px_rgba(253,77,77,0.15)]"
								style={{
									animation: "float 4s ease-in-out infinite",
								}}
								priority
							/>
						</div>
					</div>
				</section>

				{/* ABOUT */}
				<section id="about" className="py-32">
					<RoleCards />
				</section>

				{/* DEMO */}
				<section id="demo" className="py-32">
					<AppFeedDemo />
				</section>

				{/* IMPACT */}
				<section id="impact" className="py-32">
					<StatsSection />
				</section>
			</div>
			<Footer />
		</>
	);
}
