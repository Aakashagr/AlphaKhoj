# https://stackoverflow.com/questions/71785664/streamlit-capturing-usersession-and-reloading-the-app
# https://discuss.streamlit.io/t/creating-a-nicely-formatted-search-field/1804/5


import streamlit as st
import pandas as pd
import numpy as np
import time
from PIL import Image
import random

# st.title('Displaying images')
df = pd.read_csv('stimuli.csv')

# latest_iteration = st.empty()
# bar = st.progress(0)

# for i in range(10):
#   # Update the progress bar with each iteration.
#   latest_iteration.text(f'Iteration {i+1}')
#   bar.progress(i+10)

if 'data' not in st.session_state:
    st.session_state['data'] = df.to_numpy()


if len(st.session_state['data']) > 0:    
    T = st.session_state['data'][0,0] # Target
    D = st.session_state['data'][0,1] # Distractor
    Tloc = random.randint(0,8) # Target location
    
    stimorder = np.tile(D,9)
    stimorder[Tloc] = T

    def btn_state(r):
        RT = time.time() - st.session_state['on_time'] 
        st.write(st.session_state['data'])
        audio_file = open('xx.mp3', 'rb')
        audio_bytes = audio_file.read()
    
        st.markdown("""
                <audio autoplay>
                <source src="audio/a.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>""", 
                # <video controls width="250" autoplay="true" muted="true" loop="true">
                # <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" 
                    # type="video/mp4" /> </video> """,
                    unsafe_allow_html=True)


        if r == Tloc:
            st.title('Correct')
        else:
            st.title("wrong")
            st.session_state['data'] = np.r_[st.session_state['data'], [st.session_state['data'][0,:]]]
        
        st.write(RT)
        st.session_state['data'] = np.delete(st.session_state['data'] , 0, 0)
        np.random.shuffle(st.session_state['data'])   
        
        

    st.session_state['on_time'] = time.time() # Start time of stimulus presentation
    col1, col2, col3 = st.columns(3)
    with col1:
        for r in range(3):
            st.button(stimorder[r], key = r, on_click = btn_state, args = (r,)) 
        
    with col2:
        for r in range(3):
            st.button(stimorder[r+3], key = r+3,  on_click = btn_state, args = (r+3,))
            
    with col3:
        for r in range(3):
            st.button(stimorder[r+6], key = r+6,  on_click = btn_state, args = (r+6,))

else:
    st.write('Done')
# st.write(st.session_state['bid'])

# if sum(st.session_state['bid']):
#     RT = time.time() - st.session_state['on_time']
#     if np.where(st.session_state['bid'])[0] == 6:
#         st.title('Correct')
#     else:
#         st.title("wrong")

#     st.session_state['trial'] += 1
#     st.write(RT)

#     with col2:        
#        nxt_btn = st.button('NEXT', on_click = store_data)
#        st.session_state['btn-state'] = 0
#        st.session_state['bid'] = np.zeros((9,1))

    

m = st.markdown("""
<style>
div.stButton > button:first-child {
    font-size: 96px;
    border: none;
    padding: 0px 45px;
}
</style>""", unsafe_allow_html=True)
                