import { createSignal, For, Show } from 'solid-js';

function App() {
  const [stations, setStations] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [currentStation, setCurrentStation] = createSignal(null);
  const [currentCountry, setCurrentCountry] = createSignal(null);

  const arabCountries = [
    { name: 'مصر', code: 'Egypt' },
    { name: 'السعودية', code: 'Saudi Arabia' },
    { name: 'الإمارات', code: 'United Arab Emirates' },
    { name: 'الكويت', code: 'Kuwait' },
    { name: 'قطر', code: 'Qatar' },
    { name: 'البحرين', code: 'Bahrain' },
    { name: 'عمان', code: 'Oman' },
    { name: 'اليمن', code: 'Yemen' },
    { name: 'العراق', code: 'Iraq' },
    { name: 'سوريا', code: 'Syria' },
    { name: 'لبنان', code: 'Lebanon' },
    { name: 'الأردن', code: 'Jordan' },
    { name: 'فلسطين', code: 'Palestine' },
    { name: 'ليبيا', code: 'Libya' },
    { name: 'السودان', code: 'Sudan' },
    { name: 'المغرب', code: 'Morocco' },
    { name: 'الجزائر', code: 'Algeria' },
    { name: 'تونس', code: 'Tunisia' },
    { name: 'موريتانيا', code: 'Mauritania' },
    { name: 'جيبوتي', code: 'Djibouti' },
    { name: 'الصومال', code: 'Somalia' },
    { name: 'جزر القمر', code: 'Comoros' },
  ];

  const fetchStations = async (countryCode) => {
    setLoading(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(countryCode)}`);
      if (response.ok) {
        const data = await response.json();
        // إزالة المحطات المكررة التي تحمل نفس الاسم أو الرابط
        const uniqueStations = data.filter((station, index, self) =>
          index === self.findIndex((s) => (
            s.name === station.name && s.url_resolved === station.url_resolved
          ))
        );
        setStations(uniqueStations);
      } else {
        console.error('Error fetching stations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = () => {
    const query = searchQuery().toLowerCase();
    return stations().filter((station) =>
      station.name.toLowerCase().includes(query)
    );
  };

  const selectCountry = (country) => {
    setCurrentCountry(country);
    setCurrentStation(null);
    setSearchQuery('');
    setStations([]);
    fetchStations(country.code);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 flex flex-col">
      <h1 class="text-4xl font-bold text-blue-800 mb-4 text-center">راديو عربي احترافي</h1>
      <Show when={!currentCountry()}>
        <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">اختر دولة</h2>
        <div class="flex justify-center">
          <select
            class="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border cursor-pointer text-blue-800"
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedCountry = arabCountries.find(country => country.code === selectedCode);
              if (selectedCountry) {
                selectCountry(selectedCountry);
              }
            }}
          >
            <option value="" selected disabled>اختر دولة</option>
            <For each={arabCountries}>
              {(country) => (
                <option value={country.code}>{country.name}</option>
              )}
            </For>
          </select>
        </div>
      </Show>
      <Show when={currentCountry()}>
        <button
          class="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer self-start"
          onClick={() => {
            setCurrentCountry(null);
            setStations([]);
          }}
        >
          العودة إلى قائمة الدول
        </button>
        <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">محطات الراديو في {currentCountry().name}</h2>
        <div class="flex flex-col md:flex-row md:space-x-4">
          <div class="md:w-1/3">
            <input
              type="text"
              placeholder="بحث"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.target.value)}
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border text-blue-800"
            />
            <Show
              when={!loading()}
              fallback={
                <p class="text-center text-blue-800">جاري التحميل...</p>
              }
            >
              <div class="max-h-[60vh] overflow-y-auto">
                <For each={filteredStations()}>
                  {(station) => (
                    <button
                      class="w-full p-4 mb-2 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer text-left text-blue-800"
                      onClick={() => setCurrentStation(station)}
                    >
                      <p class="font-semibold">{station.name}</p>
                      <p class="text-gray-600 text-sm">{station.country}</p>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div class="md:w-2/3 mt-4 md:mt-0 flex flex-col items-center">
            <Show when={currentStation()}>
              <div class="w-full">
                <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">{currentStation().name}</h2>
                <audio
                  src={currentStation().url_resolved}
                  controls
                  autoplay
                  class="w-full"
                />
              </div>
            </Show>
            <Show when={!currentStation()}>
              <p class="text-center text-blue-800">اختر محطة من القائمة لتشغيلها</p>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;