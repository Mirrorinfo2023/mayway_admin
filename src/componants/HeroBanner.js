// components/HeroBanner.js
import Image from 'next/image';

export default function HeroBanner() {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-8 mt-6 flex flex-col md:flex-row items-center justify-between">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold">Summer Collection 2024</h1>
                <p className="mt-2">Discover the latest trends with up to 40% off</p>
                <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300">
                    Shop Now
                </button>
            </div>
            <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                alt="Summer Collection"
                width={192} 
                height={192} 
                className="mt-6 md:mt-0 md:ml-8 rounded-lg object-cover shadow-lg"
            />


        </section>
    );
}