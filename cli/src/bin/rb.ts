#!/usr/bin/env node

import { addRB } from "../rbTool";

addRB(process.argv.slice(2).join(' '))
