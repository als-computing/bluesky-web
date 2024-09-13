const als_logo = "/images/als_logo_wheel.png";

export default function Header() {
    return (
        <header className="flex items-center h-8 py-8 justify-center space-x-4">
            <img src={als_logo} alt="als logo" className="h-8 w-auto"/>
            <h1 className="text-4xl text-sky-700">Bluesky Web</h1>
        </header>
    )
}