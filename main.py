import customtkinter
from PIL import Image
from io import BytesIO
import requests
import json
import os
from threading import Thread
from googletrans import Translator
from tkinter import filedialog
import base64

translator = Translator()
img = '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'

customtkinter.set_appearance_mode("dark")

app = customtkinter.CTk()
app.resizable(False, False)
app.title('Anime Searcher')
x = (app.winfo_screenwidth() - app.winfo_reqwidth()) // 2 - (920 // 4)
y = (app.winfo_screenheight() - app.winfo_reqheight()) // 2 - (700 // 4)
app.wm_geometry(f"+{x}+{y}")
app.geometry("920x700")

customtkinter.set_widget_scaling(1.3)

def generate_card(response, row, similarity):
    frame = customtkinter.CTkFrame(master=scrollable_frame)
    frame.grid(row=row, column=0, pady=(10, 0), sticky='ew')
    my_image = customtkinter.CTkImage(light_image=Image.open(BytesIO(requests.get(response['data'][0]['images']['jpg']['image_url']).content)),
                                    dark_image=Image.open(BytesIO(requests.get(response['data'][0]['images']['jpg']['image_url']).content)),
                                    size=(168.75, 240))

    image_label = customtkinter.CTkLabel(frame, image=my_image, text="")
    image_label.grid(row=0, column=0, padx=(5,0), pady=5)

    result = customtkinter.CTkTextbox(frame, fg_color='transparent', width=450, height=250, spacing1=5)
    try:
        ru_text = translator.translate(response['data'][0]['title_english'], src='en', dest='ru').text
    except:
        ru_text = 'None'

    text= f'''
title: {response['data'][0]['title']}
title (english): {response['data'][0]['title_english']}
title (russian): {ru_text}
episodes: {response['data'][0]['episodes']}
status: {response['data'][0]['status']}
season: {response['data'][0]['season']} {response['data'][0]['year']}
genres: {', '.join([name['name'] for name in response['data'][0]['genres']])}
producers: {', '.join([name['name'] for name in response['data'][0]['producers']])}
similarity: {round(similarity * 100, 2)} %
'''

    result.insert("0.0", text)
    result.configure(state='disabled')
    result.grid(row=0, column=1, padx=(5,0), sticky='w')

def search():
    global scrollable_frame
    scrollable_frame.destroy()
    scrollable_frame = customtkinter.CTkScrollableFrame(app, height=450, width=630, fg_color='transparent')
    scrollable_frame.grid(row=1, column=0, columnspan=3, padx=(25,0), pady=(5,0), sticky='ew')
    label = customtkinter.CTkLabel(scrollable_frame, text="searching...", fg_color="transparent")
    label.grid(row=0, column=0, padx=(300,0))
    url = search_url.get()
    if os.path.isfile(url) == True:
        response = requests.post("https://api.trace.moe/search?anilistInfo", data=open(url, "rb"), headers={"Content-Type": f"image/{url.split('.')[-1]}"})
    else:
        response = requests.get(f'https://api.trace.moe/search?anilistInfo&url={url}')
    if response.status_code == 402:
        search_url.delete(0, len(search_url.get()))
        search_url.insert(0, 'Error: Search quota depleted / Concurrency limit exceeded')
        label.destroy()
        return
    if response.status_code != 200:
        search_url.delete(0, len(search_url.get()))
        search_url.insert(0, 'Error: url error')
        label.destroy()
        return

    for i, name in enumerate(json.loads(response.text)['result'][:5]):
        params = {
            'q': name['anilist']['title']['romaji'],
            'limit': 1
        }

        response = requests.get('https://api.jikan.moe/v4/anime', params=params)
        label.destroy()
        generate_card(json.loads(response.text), i, name['similarity'])

def on_search():
    t = Thread(target=search, daemon=True)
    t.start()

def file_open():
    filename = filedialog.askopenfilename(title = "Select a File")
    search_url.delete(0,len(search_url.get()))
    search_url.insert(0, filename)

search_url = customtkinter.CTkEntry(app, width=540, placeholder_text="enter your url / path")
search_url.grid(row=0, column=0, pady=(20, 0), padx=(30,10), sticky='w')
image = customtkinter.CTkImage(Image.open(BytesIO(base64.b64decode(img))))
file_butt = customtkinter.CTkButton(app, image=image, text="", width=30, command=file_open)
file_butt.grid(row=0, column=1, pady=(20, 0))
searsh_butt = customtkinter.CTkButton(app, text="search", width=50, command=on_search)
searsh_butt.grid(row=0, column=2, pady=(20, 0))
scrollable_frame = customtkinter.CTkScrollableFrame(app, height=450, width=630, fg_color='transparent')
scrollable_frame.grid(row=1, column=0, columnspan=3, padx=(25,0), pady=(5,0), sticky='ew')

app.mainloop()