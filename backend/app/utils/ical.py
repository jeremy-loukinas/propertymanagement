from ics import Calendar
import requests
def parse_ical(url: str):
  resp = requests.get(url, timeout=15); resp.raise_for_status()
  cal = Calendar(resp.text); events = []
  for e in cal.events:
    events.append({"uid": getattr(e, "uid", None),"name": e.name,"begin": e.begin.date() if hasattr(e, "begin") else None,"end": e.end.date() if hasattr(e, "end") else None})
  return events
