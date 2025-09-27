from bs4 import BeautifulSoup

# читаем исходный HTML
with open("index.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# удаляем все атрибуты data-aos
for tag in soup.find_all(attrs={"data-aos": True}):
    del tag["data-aos"]

# сохраняем в новый файл
with open("index_clean.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("✅ Все data-aos удалены! Результат в index_clean.html")
