import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Crea, Diseña y Colabora con{" "}
          <span className="text-indigo-500">PaintHouse</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
          ¿Necesitas diseñar modelos previos a comenzar tus trabajos?
          <br />
          PaintHouse es la plataforma ideal para artistas y diseñadores que
          buscan inspiración y colaboración.
        </p>
        <Link
          to="/paintModels"
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg"
        >
          ¡Pruébalo Gratis!
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Herramientas Avanzadas",
              desc: "Potencia tu creatividad con nuestras herramientas de diseño.",
            },
            {
              title: "Descarga Gratis",
              desc: "Accede a una amplia gama de recursos sin costo alguno.",
            },
            {
              title: "Diversidad de Modelos",
              desc: "Explora una colección diversa de modelos y diseños.",
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 text-center bg-indigo-600">
        <h2 className="text-4xl font-bold mb-4">
          ¿Listo para dar el siguiente paso?
        </h2>
        <p className="mb-6 text-lg">
          Empieza a diseñar hoy mismo tu propio modelo con PaintHouse.
        </p>
        <Link
          to="/paintModels"
          className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:bg-gray-200"
        >
          ¡Unirme Ahora!
        </Link>
      </section>
    </div>
  );
};
