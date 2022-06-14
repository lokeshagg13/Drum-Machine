import pygame
import json
import math
from pygame import mixer
pygame.init()

infoObject = pygame.display.Info()
WIDTH = infoObject.current_w
HEIGHT = infoObject.current_h - 50
BOTTOM_BOX_HEIGHT = 200
BOTTOM_BOX_WIDTH = WIDTH
LEFT_BOX_WIDTH = 200
LEFT_BOX_HEIGHT = HEIGHT - BOTTOM_BOX_HEIGHT
LEFT_BOX_PADDING = 20
BEAT_BOX_THICKNESS = 5
BOTTOM_BOX_PADDING = 50
BOTTOM_BOX_ITEMS_MARGIN = 50
BOTTOM_BOX_ITEMS_PRIME_HEIGHT = 75
BOTTOM_BOX_ITEMS_SHORT_HEIGHT = BOTTOM_BOX_ITEMS_PRIME_HEIGHT // 2
PLAY_PAUSE_BUTTON_PADDING = 20
BPM_DISPLAY_PADDING = 10
BPM_CHANGE_BUTTON_PADDING = 5
BEATS_DISPLAY_PADDING = 10
BEATS_CHANGE_BUTTON_PADDING = 5
SAVE_LOAD_BUTTON_PADDING_LEFT = 50
SAVE_LOAD_BUTTON_PADDING_TOP = 3
CLEAR_BOARD_BUTTON_PADDING_LEFT = 10
CLEAR_BOARD_BUTTON_PADDING_TOP = 20
EXIT_BUTTON_COORD_X = WIDTH - 200
EXIT_BUTTON_COORD_Y = 40
EXIT_BUTTON_WIDTH = 40
EXIT_BUTTON_HEIGHT = 40


black = (0, 0, 0)
white = (255, 255, 255)
gray = (128, 128, 128)
dark_gray = (55, 55, 55)
green = (0, 255, 0)
gold = (212, 175, 55)
blue = (0, 255, 255)
red = (255, 0, 0)
yellow = (255, 255, 0)

screen = pygame.display.set_mode([WIDTH, HEIGHT])
pygame.display.set_caption('Beat Maker')
label_font = pygame.font.Font('Roboto-Bold.ttf', 32)
medium_font = pygame.font.Font('Roboto-Bold.ttf', 24)

fps = 60
timer = pygame.time.Clock()

boxes = []
instruments_file = open('instruments.json')
instruments_list = json.load(instruments_file)
instruments_file.close()
number_of_instruments = len(instruments_list)
beats = 8
clicked = [[False for _ in range(beats)] for _ in range(number_of_instruments)]
bpm = 240
playing = True
active_length = 0
active_beat = 1
beat_changed = True
maximum_beats = 30
INSTRUMENT_AREA_HEIGHT = LEFT_BOX_HEIGHT // number_of_instruments
save_menu = False
load_menu = False
saved_beats_file = open('saved_beats.json')
saved_beats = json.load(saved_beats_file)
saved_beats_file.close()
beat_name = ''
save_status = ''
typing = False
max_per_page_beats = 5
current_page = 1 if len(saved_beats) > 0 else 0
selected_beat = 1 if len(saved_beats) > 0 else 0

# load in sounds
for i in range(number_of_instruments):
    instruments_list[i]['sound'] = mixer.Sound(instruments_list[i]['sound_file_path'])
    instruments_list[i]['is_active'] = True
pygame.mixer.set_num_channels(3 * number_of_instruments)
# Usually a sound need a channel to play. The programs tell pygame to start playing audio and
# it selects an available channel automatically. In case, the bpm is high that a sound starts overlapping
# we need more than 8 simultaneous channel (which is by default). So, we will keep 3 channels for each instrument.

def play_notes():
    for i in range(len(clicked)):
        if(clicked[i][active_beat] == True and instruments_list[i]['is_active'] == True):
            instruments_list[i]['sound'].play()

def divide_saved_beats_to_pages(saved_beats):
    pages_list = []
    number_of_pages = math.ceil(len(saved_beats) / max_per_page_beats)
    beat_ctr = 0
    for p in range(number_of_pages):
        ctr = 0
        page_content = []
        while(beat_ctr < len(saved_beats) and ctr < max_per_page_beats):
            page_content.append(saved_beats[beat_ctr])
            beat_ctr += 1
            ctr += 1
        pages_list.append(page_content)
    return pages_list

def draw_exit_button():
    exit_btn = pygame.draw.rect(screen, gray,
                                [EXIT_BUTTON_COORD_X, EXIT_BUTTON_COORD_Y, EXIT_BUTTON_WIDTH, EXIT_BUTTON_HEIGHT], 0, 5)
    exit_text = label_font.render('X', True, white)
    screen.blit(exit_text, (EXIT_BUTTON_COORD_X + 10, EXIT_BUTTON_COORD_Y + 5))
    return exit_btn

def draw_grid(clicks, beat):
    left_box = pygame.draw.rect(screen, gray, [0, 0, LEFT_BOX_WIDTH, LEFT_BOX_HEIGHT], 5)
    bottom_box = pygame.draw.rect(screen, gray, [0, LEFT_BOX_HEIGHT, BOTTOM_BOX_WIDTH, BOTTOM_BOX_HEIGHT], 5)
    boxes = []

    for idx in range(number_of_instruments):
        instrument = instruments_list[idx]
        text = label_font.render(instrument['instrument_name'], True, white if instrument['is_active'] else gray)
        screen.blit(text, (LEFT_BOX_PADDING, (idx * INSTRUMENT_AREA_HEIGHT) + LEFT_BOX_PADDING))
        pygame.draw.line(screen, gray, (0, (idx + 1) * INSTRUMENT_AREA_HEIGHT),
                         (LEFT_BOX_WIDTH, (idx + 1) * INSTRUMENT_AREA_HEIGHT), 5)

    beat_box_container_width = (WIDTH - LEFT_BOX_WIDTH) // beats
    beat_box_container_height = INSTRUMENT_AREA_HEIGHT
    beat_box_width = beat_box_container_width - 2 * BEAT_BOX_THICKNESS
    beat_box_height = beat_box_container_height - 2 * BEAT_BOX_THICKNESS

    for i in range(beats):
        for j in range(number_of_instruments):
            beat_box_top_left_x = i * beat_box_container_width + LEFT_BOX_WIDTH + 5
            beat_box_top_left_y = j * beat_box_container_height + 5
            beat_box_container_top_left_x = i * beat_box_container_width + LEFT_BOX_WIDTH
            beat_box_container_top_left_y = j * beat_box_container_height
            if(clicks[j][i] == False):
                color = gray
            else:
                if(instruments_list[j]['is_active'] == False):
                    color = dark_gray
                elif i == beat:
                    color = yellow
                else:
                    color = green
            rect = pygame.draw.rect(screen, color, [beat_box_top_left_x, beat_box_top_left_y,
                                                   beat_box_width, beat_box_height], 0, 3)
            pygame.draw.rect(screen, gold, [beat_box_container_top_left_x, beat_box_container_top_left_y,
                                             beat_box_container_width, beat_box_container_height], 5, 5)
            pygame.draw.rect(screen, black, [beat_box_container_top_left_x, beat_box_container_top_left_y,
                                            beat_box_container_width, beat_box_container_height], 2, 5)
            boxes.append({"rect": rect, "coords": (i, j)})
        active_beat_box_top_left_x = beat * beat_box_container_width + LEFT_BOX_WIDTH + 2
        active_beat_box_top_left_y = 0
        active = pygame.draw.rect(screen, blue, [active_beat_box_top_left_x, active_beat_box_top_left_y, beat_box_container_width, LEFT_BOX_HEIGHT], 5, 3)
    return boxes

def draw_save_menu(beat_name, typing):
    pygame.draw.rect(screen, white, [0, 0, WIDTH, HEIGHT])
    pygame.draw.rect(screen, black, [190, 35, WIDTH - 170 * 2, HEIGHT - 35 * 2])
    save_menu_heading_coords = (600, 40)
    menu_text = label_font.render('SAVE MENU', True, white)
    screen.blit(menu_text, [save_menu_heading_coords[0], save_menu_heading_coords[1]])
    input_label_coords = (save_menu_heading_coords[0] - 50, save_menu_heading_coords[1] + 100)
    input_label = medium_font.render('Enter a name for current beat', True, white)
    screen.blit(input_label, [input_label_coords[0], input_label_coords[1]])
    entry_box_coords = (400, 200)
    entry_box_dim = (600, 200)
    entry_box = pygame.draw.rect(screen, gray, [entry_box_coords[0], entry_box_coords[1], entry_box_dim[0], entry_box_dim[1]], 5, 5)
    entry_text = label_font.render(f'{beat_name}', True, white)
    if typing:
        pygame.draw.rect(screen, dark_gray, [entry_box_coords[0], entry_box_coords[1], entry_box_dim[0], entry_box_dim[1]], 0, 5)
    screen.blit(entry_text, (entry_box_coords[0] + 20, entry_box_coords[1] + 50))
    saving_btn_coords = (500, HEIGHT * 0.75 - 50)
    saving_btn_dim = (400, 100)
    saving_btn = pygame.draw.rect(screen, gray,
                                  [saving_btn_coords[0], saving_btn_coords[1], saving_btn_dim[0], saving_btn_dim[1]], 0,
                                  5)
    saving_text = label_font.render('Save Beat', True, white)
    screen.blit(saving_text, (saving_btn_coords[0] + 130, saving_btn_coords[1] + 30))
    saving_status = medium_font.render(save_status, True, white)
    screen.blit(saving_status, (input_label_coords[0] + 20, HEIGHT - 70))
    exit_btn = draw_exit_button()
    return exit_btn, saving_btn, entry_box

def draw_load_menu(pages_list, current_page, selected_beat):
    pygame.draw.rect(screen, white, [0, 0, WIDTH, HEIGHT])
    pygame.draw.rect(screen, black, [190, 35, WIDTH - 170 * 2, HEIGHT - 35 * 2])
    load_menu_heading_coords = (600, 40)
    menu_text = label_font.render('LOAD MENU', True, white)
    screen.blit(menu_text, [load_menu_heading_coords[0], load_menu_heading_coords[1]])
    list_box_coords = (350, 100)
    list_box_dim = (600, 400)
    list_box = pygame.draw.rect(screen, gray,
                                 [list_box_coords[0], list_box_coords[1], list_box_dim[0], list_box_dim[1]], 5, 5)
    total_pages = len(pages_list)
    paginator_box_coords = (355, 105)
    paginator_box_dim = (590, 40)
    paginator_box = pygame.draw.rect(screen, yellow,
                                [paginator_box_coords[0], paginator_box_coords[1], paginator_box_dim[0], paginator_box_dim[1]], 0, 5)
    paginator_left_btn_coords = (360, 110)
    paginator_left_btn_dim = (30, 30)
    paginator_left_btn = pygame.draw.rect(screen, black,
                                     [paginator_left_btn_coords[0], paginator_left_btn_coords[1], paginator_left_btn_dim[0],
                                      paginator_left_btn_dim[1]], 0, 5)
    paginator_left_text = medium_font.render('<', True, white)
    screen.blit(paginator_left_text, (paginator_left_btn_coords[0] + 5, paginator_left_btn_coords[1]))
    if current_page >= 1:
        paginator_text = medium_font.render(f'Page {current_page} of {total_pages}', True, black)
        screen.blit(paginator_text, (600, paginator_left_btn_coords[1]))
    else:
        paginator_text = medium_font.render('No beats saved', True, black)
        screen.blit(paginator_text, (600, paginator_left_btn_coords[1]))

    paginator_right_btn_coords = (910, 110)
    paginator_right_btn_dim = (30, 30)
    paginator_right_btn = pygame.draw.rect(screen, black,
                                          [paginator_right_btn_coords[0], paginator_right_btn_coords[1],
                                           paginator_right_btn_dim[0],
                                           paginator_right_btn_dim[1]], 0, 5)
    paginator_right_text = medium_font.render('>', True, white)
    screen.blit(paginator_right_text, (paginator_right_btn_coords[0] + 5, paginator_right_btn_coords[1]))

    beat_container_width = paginator_box_dim[0]
    beat_container_height = (list_box_dim[1] - paginator_box_dim[1]) // (1.5 * max_per_page_beats)
    pages_rect = []
    page_content = pages_list[current_page - 1] if current_page >= 1 else []
    for i in range(len(page_content)):
        beat_select_box_x = paginator_box_coords[0]
        beat_select_box_y = paginator_box_coords[1] + paginator_box_dim[1] + (i + 1) * beat_container_height
        rect = pygame.rect.Rect((beat_select_box_x, beat_select_box_y),
                                (beat_container_width, beat_container_height))
        pages_rect.append(rect)
        if selected_beat == i + 1:
            pygame.draw.rect(screen, gray, [beat_select_box_x, beat_select_box_y,
                                beat_container_width, beat_container_height], 0, 5)
        beat_text = medium_font.render(f'{(current_page - 1) * max_per_page_beats + i + 1}  {page_content[i]["name"]}', True, white)
        screen.blit(beat_text, (beat_select_box_x + 10, beat_select_box_y + 2))

    delete_btn_coords = (350, 510)
    delete_btn_dim = (290, 75)
    delete_btn = pygame.draw.rect(screen, gray,
                                   [delete_btn_coords[0], delete_btn_coords[1], delete_btn_dim[0],
                                    delete_btn_dim[1]], 0,
                                   5)
    delete_text = label_font.render('Delete Beat', True, white)
    screen.blit(delete_text, (delete_btn_coords[0] + 60, delete_btn_coords[1] + 20))
    loading_btn_coords = (660, 510)
    loading_btn_dim = (290, 75)
    loading_btn = pygame.draw.rect(screen, gray,
                                  [loading_btn_coords[0], loading_btn_coords[1], loading_btn_dim[0], loading_btn_dim[1]], 0,
                                  5)
    loading_text = label_font.render('Load Beat', True, white)
    screen.blit(loading_text, (loading_btn_coords[0] + 70, loading_btn_coords[1] + 20))

    # loading_status = medium_font.render(loading_status, True, white)
    # screen.blit(loading_status, (loading_btn_coords[0] + 20, HEIGHT - 70))
    exit_btn = draw_exit_button()
    return exit_btn, pages_rect, paginator_left_btn, paginator_right_btn, loading_btn, delete_btn

run = True
while run:
    timer.tick(fps)
    screen.fill(black)
    boxes = draw_grid(clicked, active_beat)

    # Bottom Menu Buttons
    play_pause_button_coords = (BOTTOM_BOX_PADDING, LEFT_BOX_HEIGHT + BOTTOM_BOX_PADDING)
    play_pause_button_dim = (125, BOTTOM_BOX_ITEMS_PRIME_HEIGHT)
    play_pause_button = pygame.draw.rect(screen, gray, [play_pause_button_coords[0], play_pause_button_coords[1], play_pause_button_dim[0], play_pause_button_dim[1]], 0, 5)
    if playing:
        play_pause_text = 'Pause'
        play_pause_text2 = 'Playing'
    else:
        play_pause_text = 'Play'
        play_pause_text2 = 'Paused'
    play_pause_button_text = label_font.render(play_pause_text, True, white)
    screen.blit(play_pause_button_text, (play_pause_button_coords[0] + PLAY_PAUSE_BUTTON_PADDING, play_pause_button_coords[1] + PLAY_PAUSE_BUTTON_PADDING))
    play_pause_below_text = medium_font.render(play_pause_text2, True, blue)
    screen.blit(play_pause_below_text, (play_pause_button_coords[0], play_pause_button_coords[1] + 80))

    # BPM increase/decrease functionality
    # ------ BPM display ---------
    bpm_display_coords = (play_pause_button_coords[0] + play_pause_button_dim[0] + BOTTOM_BOX_ITEMS_MARGIN, play_pause_button_coords[1])
    bpm_display_dim = (210, BOTTOM_BOX_ITEMS_PRIME_HEIGHT)
    bpm_display = pygame.draw.rect(screen, gray, [bpm_display_coords[0], bpm_display_coords[1], bpm_display_dim[0], bpm_display_dim[1]], 0, 5)
    bpm_display_label = medium_font.render('Beats per minute', True, white)
    screen.blit(bpm_display_label, (bpm_display_coords[0] + BPM_DISPLAY_PADDING,
                bpm_display_coords[1] + BPM_DISPLAY_PADDING))
    bpm_value = medium_font.render(f'{bpm}', True, white)
    screen.blit(bpm_value, (bpm_display_coords[0] + BPM_DISPLAY_PADDING + 50, bpm_display_coords[1] + BPM_DISPLAY_PADDING + 30))
    # ------ BPM up/down button ---------
    bpm_up_down_button_dim = (40, BOTTOM_BOX_ITEMS_PRIME_HEIGHT//2 - 5)
    bpm_up_button_coords = (bpm_display_coords[0] + bpm_display_dim[0] + 5, bpm_display_coords[1])
    bpm_down_button_coords = (bpm_display_coords[0] + bpm_display_dim[0] + 5, bpm_display_coords[1] + BOTTOM_BOX_ITEMS_PRIME_HEIGHT//2)
    bpm_up_button = pygame.draw.rect(screen, green,
                                     [bpm_up_button_coords[0], bpm_up_button_coords[1], bpm_up_down_button_dim[0],
                                      bpm_up_down_button_dim[1]], 0, 5)
    bpm_up_button_text = medium_font.render('+ 5', True, black)
    screen.blit(bpm_up_button_text, (bpm_up_button_coords[0] + BPM_CHANGE_BUTTON_PADDING, bpm_up_button_coords[1] + BPM_CHANGE_BUTTON_PADDING - 5))
    bpm_down_button = pygame.draw.rect(screen, red,
                                     [bpm_down_button_coords[0], bpm_down_button_coords[1], bpm_up_down_button_dim[0],
                                      bpm_up_down_button_dim[1]], 0, 5)
    bpm_down_button_text = medium_font.render('- 5', True, white)
    screen.blit(bpm_down_button_text, (bpm_down_button_coords[0] + BPM_CHANGE_BUTTON_PADDING, bpm_down_button_coords[1] + BPM_CHANGE_BUTTON_PADDING - 5))

    # Beats increase/decrease functionality
    # ------ Beats display ---------
    beats_display_coords = (
    bpm_up_button_coords[0] + bpm_up_down_button_dim[0] + BOTTOM_BOX_ITEMS_MARGIN,
    play_pause_button_coords[1])
    beats_display_dim = (210, BOTTOM_BOX_ITEMS_PRIME_HEIGHT)
    beats_display = pygame.draw.rect(screen, gray, [beats_display_coords[0], beats_display_coords[1], beats_display_dim[0],
                                                  beats_display_dim[1]], 0, 5)
    beats_display_label = medium_font.render('Number of beats', True, white)
    screen.blit(beats_display_label, (beats_display_coords[0] + BEATS_DISPLAY_PADDING,
                                    beats_display_coords[1] + BEATS_DISPLAY_PADDING))
    beats_value = medium_font.render(f'{beats}', True, white)
    screen.blit(beats_value,
                (beats_display_coords[0] + BEATS_DISPLAY_PADDING + 50, beats_display_coords[1] + BEATS_DISPLAY_PADDING + 30))
    # ------ Beats up/down button ---------
    beats_up_down_button_dim = (40, BOTTOM_BOX_ITEMS_SHORT_HEIGHT - 5)
    beats_up_button_coords = (beats_display_coords[0] + beats_display_dim[0] + 5, beats_display_coords[1])
    beats_down_button_coords = (
    beats_display_coords[0] + beats_display_dim[0] + 5, beats_display_coords[1] + BOTTOM_BOX_ITEMS_SHORT_HEIGHT)
    beats_up_button = pygame.draw.rect(screen, green,
                                     [beats_up_button_coords[0], beats_up_button_coords[1], beats_up_down_button_dim[0],
                                      beats_up_down_button_dim[1]], 0, 5)
    beats_up_button_text = medium_font.render('+ 1', True, black)
    screen.blit(beats_up_button_text, (
    beats_up_button_coords[0] + BEATS_CHANGE_BUTTON_PADDING, beats_up_button_coords[1] + BEATS_CHANGE_BUTTON_PADDING - 5))
    beats_down_button = pygame.draw.rect(screen, red,
                                       [beats_down_button_coords[0], beats_down_button_coords[1], beats_up_down_button_dim[0],
                                        beats_up_down_button_dim[1]], 0, 5)
    beats_down_button_text = medium_font.render('- 1', True, white)
    screen.blit(beats_down_button_text, (
    beats_down_button_coords[0] + BEATS_CHANGE_BUTTON_PADDING, beats_down_button_coords[1] + BEATS_CHANGE_BUTTON_PADDING - 5))

    # Instrument button
    for i in range(number_of_instruments):
        instruments_list[i]['rect'] = pygame.rect.Rect((0, i * INSTRUMENT_AREA_HEIGHT), (LEFT_BOX_WIDTH, INSTRUMENT_AREA_HEIGHT))

    # Save beats functionality
    save_button_coords = (beats_up_button_coords[0] + beats_up_down_button_dim[0] + BOTTOM_BOX_ITEMS_MARGIN, beats_up_button_coords[1])
    save_button_dim = (210, BOTTOM_BOX_ITEMS_SHORT_HEIGHT - 5)
    save_button = pygame.draw.rect(screen, gray, [save_button_coords[0], save_button_coords[1], save_button_dim[0], save_button_dim[1]], 0, 5)
    save_button_text = medium_font.render('Save Beat', True, white)
    screen.blit(save_button_text, (save_button_coords[0] + SAVE_LOAD_BUTTON_PADDING_LEFT, save_button_coords[1] + SAVE_LOAD_BUTTON_PADDING_TOP))

    # Load beats functionality
    load_button_coords = (
    beats_up_button_coords[0] + beats_up_down_button_dim[0] + BOTTOM_BOX_ITEMS_MARGIN, beats_up_button_coords[1] + BOTTOM_BOX_ITEMS_SHORT_HEIGHT)
    load_button_dim = (210, BOTTOM_BOX_ITEMS_SHORT_HEIGHT - 5)
    load_button = pygame.draw.rect(screen, gray, [load_button_coords[0], load_button_coords[1], load_button_dim[0],
                                                  load_button_dim[1]], 0, 5)
    load_button_text = medium_font.render('Load Beat', True, white)
    screen.blit(load_button_text,
                (load_button_coords[0] + SAVE_LOAD_BUTTON_PADDING_LEFT, load_button_coords[1] + SAVE_LOAD_BUTTON_PADDING_TOP))

    # Clear board functionality
    clear_button_coords = (
        save_button_coords[0] + save_button_dim[0] + BOTTOM_BOX_ITEMS_MARGIN,
        save_button_coords[1])
    clear_button_dim = (150, BOTTOM_BOX_ITEMS_PRIME_HEIGHT)
    clear_button = pygame.draw.rect(screen, gray, [clear_button_coords[0], clear_button_coords[1], clear_button_dim[0],
                                                  clear_button_dim[1]], 0, 5)
    clear_button_text = medium_font.render('Clear Board', True, white)
    screen.blit(clear_button_text,
                (clear_button_coords[0] + CLEAR_BOARD_BUTTON_PADDING_LEFT,
                 clear_button_coords[1] + CLEAR_BOARD_BUTTON_PADDING_TOP))

    if save_menu:
        exit_button, saving_btn, entry_box = draw_save_menu(beat_name, typing)
    elif load_menu:
        pages_list = divide_saved_beats_to_pages(saved_beats)
        exit_button, pages_rect, paginator_left_btn, paginator_right_btn, loading_btn, delete_btn = \
            draw_load_menu(pages_list, current_page, selected_beat)

    if beat_changed:
        play_notes()
        beat_changed = False

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
        if event.type == pygame.MOUSEBUTTONDOWN and not save_menu and not load_menu:
            for i in range(len(boxes)):
                if(boxes[i]['rect'].collidepoint(event.pos)):
                    coords = boxes[i]['coords']
                    clicked[coords[1]][coords[0]] = not clicked[coords[1]][coords[0]]
        if event.type == pygame.MOUSEBUTTONUP and not save_menu and not load_menu:
            if play_pause_button.collidepoint(event.pos):
                playing = not playing
            elif bpm_up_button.collidepoint(event.pos):
                bpm += 5
            elif bpm_down_button.collidepoint(event.pos):
                bpm -= 5
            elif beats_up_button.collidepoint(event.pos):
                if(beats < maximum_beats):
                    beats += 1
                    for i in range(len(clicked)):
                        clicked[i].append(False)     # Adding new value (unclicked beat for each instrument) at the end
            elif beats_down_button.collidepoint(event.pos):
                if(beats > 1):
                    beats -= 1
                    for i in range(len(clicked)):
                        clicked[i].pop(-1)          # Removing the last value from the end
            elif save_button.collidepoint(event.pos):
                saved_beats_file = open('saved_beats.json')
                saved_beats = json.load(saved_beats_file)
                saved_beats_file.close()
                current_page = 1 if len(saved_beats) > 0 else 0
                selected_beat = 1 if len(saved_beats) > 0 else 0
                save_menu = True
            elif load_button.collidepoint(event.pos):
                saved_beats_file = open('saved_beats.json')
                saved_beats = json.load(saved_beats_file)
                saved_beats_file.close()
                current_page = 1 if len(saved_beats) > 0 else 0
                selected_beat = 1 if len(saved_beats) > 0 else 0
                load_menu = True
            elif clear_button.collidepoint(event.pos):
                clicked = [[False for _ in range(beats)] for _ in range(number_of_instruments)]
            for i in range(number_of_instruments):
                if instruments_list[i]['rect'].collidepoint(event.pos):
                    instruments_list[i]['is_active'] = not instruments_list[i]['is_active']
        elif event.type == pygame.MOUSEBUTTONUP and save_menu:
            if exit_button.collidepoint(event.pos):
                save_menu = False
                load_menu = False
                beat_name = ''
                save_status = ''
                typing = False
            elif entry_box.collidepoint(event.pos):
                typing = not typing
            elif saving_btn.collidepoint(event.pos):
                already_names = [beat['name'] for beat in saved_beats]
                if beat_name in already_names:
                    save_status = 'Beat name already taken'
                else:
                    saved_beats.append({'name': beat_name, 'bpm': bpm, 'beats': beats, 'selected': clicked })
                    saved_beats_file = open('saved_beats.json', 'w')
                    json.dump(saved_beats, saved_beats_file)
                    saved_beats_file.close()
                    save_status = 'Saved successfully'
                    beat_name = ''
                    typing = False
        elif event.type == pygame.MOUSEBUTTONUP and load_menu:
            if exit_button.collidepoint(event.pos):
                save_menu = False
                load_menu = False
                current_page = 1 if len(saved_beats) > 0 else 0
                selected_beat = 1 if len(saved_beats) > 0 else 0
            elif paginator_left_btn.collidepoint(event.pos):
                if current_page > 1:
                    current_page -= 1
                    selected_beat = 1
            elif paginator_right_btn.collidepoint(event.pos):
                number_of_pages = math.ceil(len(saved_beats)/max_per_page_beats)
                if current_page < number_of_pages:
                    current_page += 1
                    selected_beat = 1
            elif loading_btn.collidepoint(event.pos):
                if current_page > 0 and selected_beat > 0:
                    pages_list = divide_saved_beats_to_pages(saved_beats)
                    selected_beat_obj = pages_list[current_page - 1][selected_beat - 1]
                    bpm = selected_beat_obj["bpm"]
                    beats = selected_beat_obj["beats"]
                    clicked = selected_beat_obj["selected"]
                    load_menu = False
                    save_menu = False
                    playing = True
                    current_page = 1 if len(saved_beats) > 0 else 0
                    selected_beat = 1 if len(saved_beats) > 0 else 0
            elif delete_btn.collidepoint(event.pos):
                if current_page > 0 and selected_beat > 0:
                    saved_beats_file = open('saved_beats.json')
                    saved_beats = json.load(saved_beats_file)
                    saved_beats_file.close()
                    saved_beats.pop((current_page - 1) * max_per_page_beats + selected_beat - 1)
                    saved_beats_file = open('saved_beats.json', 'w')
                    json.dump(saved_beats, saved_beats_file)
                    saved_beats_file.close()
                    if selected_beat == 1:
                        current_page -= 1
                        selected_beat = 5
            for i in range(len(pages_rect)):
                if pages_rect[i].collidepoint(event.pos):
                    selected_beat = i + 1
        if event.type == pygame.TEXTINPUT and typing:
            beat_name += event.text
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_BACKSPACE and len(beat_name) > 0:
                beat_name = beat_name[:-1]

    beat_length = fps * 60 // bpm      # related to the speed with which the player moves to the next beat or number of frames
                                       # covered in 1 beat
    if playing:
        if active_length < beat_length:
            active_length += 1
        else:
            active_length = 0
            if(active_beat < beats - 1):
                active_beat += 1
                beat_changed = True
            else:
                active_beat = 0
                beat_changed = True

    pygame.display.flip()
pygame.quit()



