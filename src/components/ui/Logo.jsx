
"use client";

import Link from "next/link";
import { GiLifeSupport } from "react-icons/gi";

const Logo = () => {

    return (
        <Link href={'/'} className="flex gap-3 items-center">
            <GiLifeSupport className="text-5xl text-purple-500" />
            <div className="flex flex-col">
                <h2 className="font-medium text-lg capitalize">Digital Life</h2>
                <span className="text-xs text-muted">Lessions</span>
            </div>
        </Link>
    );
};

export default Logo;