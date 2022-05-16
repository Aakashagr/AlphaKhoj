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


if 'data' not in st.session_state:
    st.session_state['data'] = df.to_numpy()
aud = st.empty()
placeholder = st.empty()
bid = np.zeros((9,1))



# latest_iteration = st.empty()
# bar = st.progress(0)

# for i in range(10):
#   # Update the progress bar with each iteration.
#   latest_iteration.text(f'Iteration {i+1}')
#   bar.progress(i+10)


# Display the button grid
def btn_disp(stimorder,btn_dis = 0):
    with placeholder.container():
        col1, col2, col3 = st.columns(3)
        with col1:
            for r in range(3):
                bid[r+6] = st.button(stimorder[r], key = r, on_click = btn_state, args = (r,), disabled = btn_dis) 
            
        with col2:
            for r in range(3):
                bid[r+6] = st.button(stimorder[r+3], key = r+3,  on_click = btn_state, args = (r+3,), disabled = btn_dis) 
                
        with col3:
            for r in range(3):
                bid[r+6] = st.button(stimorder[r+6], key = r+6,  on_click = btn_state, args = (r+6,), disabled = btn_dis) 
        

def btn_state(r):
    RT = time.time() - st.session_state['on_time'] 

    if r == Tloc:
        aud_file = "https://alphakhoj.s3.amazonaws.com/audio/a.mp3"

    else:
        aud_file = "https://alphakhoj.s3.amazonaws.com/audio/a.mp3"
        st.session_state['data'] = np.r_[st.session_state['data'], [st.session_state['data'][0,:]]]

    st.write(RT)
    aud.markdown(f""" <audio autoplay>
                <source src= {aud_file} type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>""", unsafe_allow_html=True)
    
    
    st.session_state['data'] = np.delete(st.session_state['data'] , 0, 0)
    np.random.shuffle(st.session_state['data'])   
    btn_disp(stimorder,1)
    time.sleep(1)


    
if len(st.session_state['data']) > 0:   
    
    # Set trial conditions
    T = st.session_state['data'][0,0] # Target
    D = st.session_state['data'][0,1] # Distractor
    Tloc = random.randint(0,8) # Target location  
    stimorder = np.tile(D,9)
    stimorder[Tloc] = T

    st.session_state['on_time'] = time.time() # Start time of stimulus presentation
    btn_disp(stimorder)

else:
    st.snow()



m = st.markdown("""
<style>
div.stButton > button:first-child {
    font-size: 96px;
    border: none;
    padding: 0px 45px;
}
</style>""", unsafe_allow_html=True)
                