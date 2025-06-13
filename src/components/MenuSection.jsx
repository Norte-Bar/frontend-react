import MenuItem from './MenuItem';

function MenuSection({ title, items }) {
  return (
    <section className="mb-12 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-3xl font-semibold text-center text-[#12263a] mb-6 border-b-2 border-[#b8b15b] pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;